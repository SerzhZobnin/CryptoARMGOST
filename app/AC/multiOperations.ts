import * as fs from "fs";
import * as path from "path";
import {
  BASE64, DER, GOST_28147,
  GOST_R3412_2015_K, GOST_R3412_2015_M, HOME_DIR,
  MULTI_DIRECT_OPERATION,
  MULTI_REVERSE_OPERATION,
  SELECT_ALL_DOCUMENTS_IN_OPERAIONS_RESULT,
  SELECT_DOCUMENT_IN_OPERAIONS_RESULT,
  START,
  SUCCESS,
  UNSELECT_ALL_DOCUMENTS_IN_OPERAIONS_RESULT,
  UNSELECT_DOCUMENT_IN_OPERAIONS_RESULT,
} from "../constants";
import { IOcspModel, ISignModel, ITspModel } from "../reducer/settings";
import * as trustedEncrypts from "../trusted/encrypt";
import * as signs from "../trusted/sign";
import { extFile, md5 } from "../utils";
import { filePackageSelect, IFile, removeAllFiles } from "./index";

interface ISignParams {
  signModel: ISignModel;
  tspModel: ITspModel;
  ocspModel: IOcspModel;
}

export function multiDirectOperation(
  files: IFile[],
  setting: any,
  signer: any,
  recipients: any,
) {
  return (dispatch: (action: {}) => void, getState: () => any) => {
    dispatch({
      payload: { operations: setting.operations },
      type: MULTI_DIRECT_OPERATION + START,
    });

    let packageResult = true;
    const directResult: any = {};
    const directFiles: any = {};

    setTimeout(async () => {
      const { operations, outfolder } = setting;
      const { archivation_operation, encryption_operation, save_copy_to_documents,
        save_result_to_folder, signing_operation } = operations;

      let signedFiles: any[] = [];

      files.forEach((file: any) => {
        directFiles[file.id] = { original: file.toJS() };
      });

      directResult.operations = operations.toJS();

      if (signing_operation) {
        const policies = ["noAttributes"];
        if (setting.sign.detached) {
          policies.push("detached");
        }
        if (setting.sign.time) {
          policies.splice(0, 1);
        }

        const params: ISignParams | null = {
          ocspModel: setting.ocsp.toJS(),
          signModel: setting.sign.toJS(),
          tspModel: setting.tsp.toJS(),
        };

        let format = trusted.DataFormat.PEM;
        if (setting.sign.encoding !== BASE64) {
          format = trusted.DataFormat.DER;
        }

        files.forEach((file: IFile) => {
          let newPath = "";
          if (file.fullpath.split(".").pop() === "sig") {
            newPath = signs.resignFile(file.fullpath, signer, policies, params, format, outfolder);
          } else {
            newPath = signs.signFile(file.fullpath, signer, policies, params, format, outfolder);
          }

          if (newPath) {
            const newFileProps = getFileProps(newPath);

            signedFiles.push({ ...newFileProps, originalId: file.id });

            directFiles[file.id] = {
              ...directFiles[file.id],
              signing_operation: {
                out: {
                  ...newFileProps,
                },
                result: true,
              },
            };
          } else {
            packageResult = false;

            directFiles[file.id] = {
              ...directFiles[file.id],
              signing_operation: {
                result: false,
              },
            };
          }
        });
      } else {
        signedFiles = [...files];
      }

      let archiveName = "";
      let archivedFiles: any[] = [];

      if (archivation_operation) {
        archiveName = await archiveFiles(signedFiles, outfolder);
        archivedFiles = [getFileProps(archiveName)];

        const newFileProps = getFileProps(archiveName);

        for (const signedFile of signedFiles) {
          const currentId = signedFile.originalId ? signedFile.originalId : signedFile.id;

          directFiles[currentId] = {
            ...directFiles[currentId],
            archivation_operation: {
              out: {
                ...newFileProps,
              },
              result: true,
            },
          };
        }
      } else {
        archivedFiles = [...signedFiles];
      }

      let encryptedFiles: any[] = [];

      if (encryption_operation) {
        const policies = { deleteFiles: setting.encrypt.delete, archiveFiles: setting.encrypt.archive };

        let encAlg = trusted.EncryptAlg.GOST_28147;
        switch (setting.encrypt.algorithm) {
          case GOST_28147:
            encAlg = trusted.EncryptAlg.GOST_28147;
            break;
          case GOST_R3412_2015_M:
            encAlg = trusted.EncryptAlg.GOST_R3412_2015_M;
            break;
          case GOST_R3412_2015_K:
            encAlg = trusted.EncryptAlg.GOST_R3412_2015_K;
            break;
        }

        let format = trusted.DataFormat.PEM;
        if (setting.encrypt.encoding !== BASE64) {
          format = trusted.DataFormat.DER;
        }

        archivedFiles.forEach((file) => {
          const newPath = trustedEncrypts.encryptFile(file.fullpath, recipients, policies, encAlg, format, outfolder);
          const currentId = file.originalId ? file.originalId : file.id;

          if (newPath) {
            const newFileProps = getFileProps(newPath);

            encryptedFiles.push(newFileProps);

            if (archivation_operation) {
              for (const signedFile of signedFiles) {
                const currentIdSigned = signedFile.originalId ? signedFile.originalId : signedFile.id;

                directFiles[currentIdSigned] = {
                  ...directFiles[currentIdSigned],
                  encryption_operation: {
                    out: {
                      ...newFileProps,
                    },
                    result: true,
                  },
                };
              }
            } else {
              directFiles[currentId] = {
                ...directFiles[currentId],
                encryption_operation: {
                  out: {
                    ...newFileProps,
                  },
                  result: true,
                },
              };
            }
          } else {
            packageResult = false;

            if (archivation_operation) {
              for (const signedFile of signedFiles) {
                const currentIdSigned = signedFile.originalId ? signedFile.originalId : signedFile.id;

                directFiles[currentIdSigned] = {
                  ...directFiles[currentIdSigned],
                  encryption_operation: {
                    result: false,
                  },
                };
              }
            } else {
              directFiles[currentId] = {
                ...directFiles[currentId],
                encryption_operation: {
                  result: false,
                },
              };
            }
          }
        });

      } else {
        encryptedFiles = [...archivedFiles];
      }

      directResult.files = directFiles;

      dispatch(removeAllFiles());

      dispatch({
        payload: { status: packageResult, directResult },
        type: MULTI_DIRECT_OPERATION + SUCCESS,
      });

    }, 0);
  };
}

const getFileProps = (fullpath: string) => {
  const stat = fs.statSync(fullpath);
  const extension = extFile(fullpath);

  return {
    active: false,
    extension,
    extra: undefined,
    filename: path.basename(fullpath),
    filesize: stat.size,
    fullpath,
    id: md5(fullpath),
    mtime: stat.birthtime,
    remoteId: undefined,
    size: stat.size,
    socket: undefined,
  };
};

async function archiveFiles(files: any[], folderOut: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let outURI: string;
    const archiveName = files.length === 1 ? `${files[0].filename}.zip` : "encrypt_files.zip";
    if (folderOut.length > 0) {
      outURI = path.join(folderOut, archiveName);
    } else {
      outURI = path.join(HOME_DIR, archiveName);
    }

    const output = fs.createWriteStream(outURI);
    const archive = window.archiver("zip");

    output.on("close", () => {
      resolve(outURI);
    });

    archive.on("error", () => {
      reject("Error archive");
    });

    archive.pipe(output);

    files.forEach((file) => {
      archive.append(fs.createReadStream(file.fullpath), { name: file.filename });
    });

    archive.finalize();
  });
}

export function selectDocument(uid: number) {
  return {
    payload: { uid },
    type: SELECT_DOCUMENT_IN_OPERAIONS_RESULT,
  };
}

export function unselectDocument(uid: string) {
  return {
    payload: { uid },
    type: UNSELECT_DOCUMENT_IN_OPERAIONS_RESULT,
  };
}

export function unselectAllDocuments() {
  return {
    type: UNSELECT_ALL_DOCUMENTS_IN_OPERAIONS_RESULT,
  };
}

export function selectAllDocuments() {
  return {
    type: SELECT_ALL_DOCUMENTS_IN_OPERAIONS_RESULT,
  };
}
