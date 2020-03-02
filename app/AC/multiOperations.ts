import * as fs from "fs";
import * as path from "path";
import { push } from "react-router-redux";
import * as unzipper from "unzipper";
import {
  ARCHIVATION_OPERATION, BASE64, DEFAULT_DOCUMENTS_PATH, DEFAULT_TEMP_PATH, DER,
  GOST_28147, GOST_R3412_2015_K, GOST_R3412_2015_M,
  HOME_DIR,
  LOCATION_RESULTS_MULTI_OPERATIONS, MULTI_DIRECT_OPERATION,
  MULTI_REVERSE_OPERATION,
  SELECT_ALL_DOCUMENTS_IN_OPERAIONS_RESULT,
  SELECT_DOCUMENT_IN_OPERAIONS_RESULT, SIGNING_OPERATION, START,
  SUCCESS,
  UNSELECT_ALL_DOCUMENTS_IN_OPERAIONS_RESULT,
  UNSELECT_DOCUMENT_IN_OPERAIONS_RESULT,
  ENCRYPTION_OPERATION,
} from "../constants";
import { IOcspModel, ISignModel, ITspModel } from "../reducer/settings";
import * as trustedEncrypts from "../trusted/encrypt";
import * as signs from "../trusted/sign";
import { extFile, fileExists, md5 } from "../utils";
import { filePackageDelete, IFile, removeAllFiles } from "./index";

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
    const filesId: any[] = [];

    setTimeout(async () => {
      const { operations, outfolder } = setting;
      const { encryption_operation, save_copy_to_documents,
        save_result_to_folder, signing_operation } = operations;

      let { archivation_operation } = operations;

      // Always archive files if set detached sign and encryption
      if (signing_operation && setting.sign.detached && encryption_operation) {
        archivation_operation = true;
      }

      let signedFiles: any[] = [];

      files.forEach((file: any) => {
        directFiles[file.id] = { original: file.toJS() };
        filesId.push(file.id);
      });

      directResult.results = [];
      directResult.operations = operations.toJS();

      if (save_copy_to_documents && !signing_operation && !archivation_operation && !encryption_operation) {
        files.forEach((file: IFile) => {
          const copyUri = path.join(DEFAULT_DOCUMENTS_PATH, path.basename(file.fullpath));

          if (!fileExists(copyUri)) {
            fs.copyFileSync(file.fullpath, copyUri);
          }
        });
      }

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

        files.forEach((file: any) => {
          let newPath = "";
          const newoutfolder = archivation_operation || encryption_operation ? DEFAULT_TEMP_PATH : save_result_to_folder ? outfolder : "";

          if (file.fullpath.split(".").pop() === "sig") {
            newPath = signs.resignFile(file.fullpath, signer, policies, params, format, newoutfolder);
          } else {
            newPath = signs.signFile(file.fullpath, signer, policies, params, format, newoutfolder);
          }

          if (newPath) {
            if (!archivation_operation) {
              if (save_copy_to_documents) {
                const copyUri = path.join(DEFAULT_DOCUMENTS_PATH, path.basename(newPath));

                if (!fileExists(copyUri)) {
                  fs.copyFileSync(newPath, copyUri);
                }
              }

              if (setting.sign.detached) {
                let copyUriOriginalFile = path.join(DEFAULT_DOCUMENTS_PATH, path.basename(file.fullpath));

                if (!fileExists(copyUriOriginalFile)) {
                  fs.copyFileSync(file.fullpath, copyUriOriginalFile);
                }

                if (save_result_to_folder && outfolder) {
                  copyUriOriginalFile = path.join(outfolder, path.basename(file.fullpath));

                  if (!fileExists(copyUriOriginalFile)) {
                    fs.copyFileSync(file.fullpath, copyUriOriginalFile);
                  }
                }
              }
            }

            const newFileProps = getFileProps(newPath);

            signedFiles.push({ ...newFileProps, originalId: file.id, originalFullpath: file.fullpath });

            directResult.results.push({
              in: {
                ...file.toJS(),
              },
              operation: SIGNING_OPERATION,
              out: {
                ...newFileProps,
              },
              result: true,
            });

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

            directResult.results.push({
              in: {
                ...file.toJS(),
              },
              operation: SIGNING_OPERATION,
              out: null,
              result: false,
            });

            directFiles[file.id] = {
              ...directFiles[file.id],
              signing_operation: {
                result: false,
              },
            };
          }
        });
      } else {
        signedFiles = [];
        files.forEach((file: any) => signedFiles.push(file.toJS()));
      }

      let archiveName = "";
      let archivedFiles: any[] = [];

      if (archivation_operation) {
        const newoutfolder = encryption_operation ? DEFAULT_TEMP_PATH : save_result_to_folder ? outfolder : "";

        let filesForArchive: any[] = signedFiles.slice(0);

        if (signing_operation && setting.sign.detached) {
          filesForArchive = filesForArchive.concat(files);
        }

        archiveName = await archiveFiles(filesForArchive, newoutfolder);
        if (!encryption_operation && save_copy_to_documents) {
          const copyUri = path.join(DEFAULT_DOCUMENTS_PATH, path.basename(archiveName));

          if (!fileExists(copyUri)) {
            fs.copyFileSync(archiveName, copyUri);
          }
        }

        archivedFiles = [getFileProps(archiveName)];

        const newFileProps = getFileProps(archiveName);

        directResult.results.push({
          in: filesForArchive,
          operation: ARCHIVATION_OPERATION,
          out: {
            ...newFileProps,
          },
          result: true,
        });

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

        let filesForEncrypt: any[] = [];

        if (signing_operation && setting.sign.detached && !archivation_operation) {
          filesForEncrypt = files.slice(0);
        } else {
          filesForEncrypt = archivedFiles.slice(0);
        }

        filesForEncrypt.forEach((file) => {
          let newoutfolder = "";

          if (save_result_to_folder) {
            newoutfolder = outfolder;
          } else if (!archivation_operation && !setting.sign.detached && file.originalFullpath) {
            newoutfolder = path.dirname(file.originalFullpath);
          } else {
            newoutfolder = "";
          }

          const newPath = trustedEncrypts.encryptFile(file.fullpath, recipients, policies, encAlg, format, newoutfolder);
          const currentId = file.originalId ? file.originalId : file.id;

          if (newPath) {
            if (save_copy_to_documents) {
              const copyUri = path.join(DEFAULT_DOCUMENTS_PATH, path.basename(newPath));

              if (!fileExists(copyUri)) {
                fs.copyFileSync(newPath, copyUri);
              }
            }

            const newFileProps = getFileProps(newPath);

            directResult.results.push({
              in: { ...file },
              operation: ENCRYPTION_OPERATION,
              out: {
                ...newFileProps,
              },
              result: true,
            });

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

            directResult.results.push({
              in: { ...file },
              operation: ENCRYPTION_OPERATION,
              out: null,
              result: false,
            });

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

      dispatch(filePackageDelete(filesId));

      dispatch({
        payload: { status: packageResult, directResult },
        type: MULTI_DIRECT_OPERATION + SUCCESS,
      });

      dispatch(push(LOCATION_RESULTS_MULTI_OPERATIONS));
    }, 0);
  };
}

export function multiReverseOperation(
  files: IFile[],
) {
  return (dispatch: (action: {}) => void, getState: () => any) => {
    dispatch({
      type: MULTI_REVERSE_OPERATION + START,
    });

    let packageResult = true;
    const reverseResult: any = {};
    let reverseFiles: any = {};

    setTimeout(async () => {
      files.forEach((file: any) => {
        const jsObjFile = file.toJS();

        reverseFiles[file.id] = { original: { ...jsObjFile, originalId: jsObjFile.id } };
      });

      files.forEach((file: any) => {
        reverseFiles = reverseOperations(file, reverseFiles, reverseResult);
      });

      reverseResult.files = reverseFiles;

      dispatch(removeAllFiles());

      dispatch({
        payload: { status: packageResult, reverseResult },
        type: MULTI_REVERSE_OPERATION + SUCCESS,
      });

      dispatch(push(LOCATION_RESULTS_MULTI_OPERATIONS));
    }, 0);
  };
}

const reverseOperations = (file: any, reverseFiles: any) => {
  if (file) {
    if (file.extension === "enc") {
      const newPath = trustedEncrypts.decryptFile(file.fullpath, "");
      const currentId = file.originalId ? file.originalId : file.id;

      if (newPath) {
        const newFileProps = { ...getFileProps(newPath), originalId: file.id };

        reverseFiles[currentId] = {
          ...reverseFiles[currentId],
          decryption_operation: {
            out: {
              ...newFileProps,
            },
            result: true,
          },
        };

        if (newFileProps.extension === "enc" || newFileProps.extension === "sig") {
          reverseOperations(newFileProps, reverseFiles);
        }
      } else {
        reverseFiles[currentId] = {
          ...reverseFiles[currentId],
          decryption_operation: {
            result: false,
          },
        };
      }
    } else if (file.extension === "sig") {
      const newPath = signs.unSign(file.fullpath, "");
      const currentId = file.originalId ? file.originalId : file.id;

      if (newPath) {
        const newFileProps = { ...getFileProps(newPath), originalId: file.id };

        reverseFiles[currentId] = {
          ...reverseFiles[currentId],
          unsign_operation: {
            out: {
              ...newFileProps,
            },
            result: true,
          },
        };

        if (newFileProps.extension === "enc" || newFileProps.extension === "sig") {
          reverseOperations(newFileProps, reverseFiles);
        }
      } else {
        reverseFiles[currentId] = {
          ...reverseFiles[currentId],
          unsign_operation: {
            result: false,
          },
        };
      }
    } else if (file.extension === "zip") {
      setTimeout(async () => {
        reverseFiles = await uzipAndWriteStream(file, reverseFiles);
      });
    }

    return reverseFiles;
  } else {
    return reverseFiles;
  }
};

async function uzipAndWriteStream(file: any, reverseFiles: any) {
  return new Promise(function (resolve, reject) {
    const currentId = file.originalId ? file.originalId : file.id;

    fs.createReadStream(file.fullpath)
      .pipe(unzipper.Parse())
      .on("entry", function (entry, e, cb = (reverseFiles: any) => {
        resolve(reverseFiles);
      }) {
        const fileName = entry.path;

        entry.pipe(fs.createWriteStream(path.join(DEFAULT_TEMP_PATH, fileName))
          .on("finish", () => {
            const newFileProps = { ...getFileProps(path.join(DEFAULT_TEMP_PATH, fileName)), originalId: file.id };

            reverseFiles[currentId] = {
              ...reverseFiles[currentId],
              unzip_operation: {
                out: {
                  ...newFileProps,
                },
                result: true,
              },
            };

            if (newFileProps.extension === "enc" || newFileProps.extension === "sig" || newFileProps.extension === "zip") {
              reverseOperations(newFileProps, reverseFiles);
            }

            cb();
          }));
      });
  });
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
