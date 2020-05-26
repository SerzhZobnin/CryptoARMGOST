import PropTypes from "prop-types";
import {
  EN, GOSR3411_94_WITH_GOSTR3410_94, GOST2001, GOST3410_12_256,
  GOST3410_12_512, GOST89, GOST94, GOSTR3411_94_WITH_GOSTR3410_2001,
} from "../constants";
import {DH, DHKEY, DSA, DSAKEY, ECC, ECDH_STD_SHA1_KDF, ECDSA_P256, ECDSA_P384, ECDSA_P521, ESDH, MD_GOST12_256, mosaicKMandUpdSig, NO_SIGN, RSA, RSA_KEYX, RSAES_OAEP, RSASSAPSSKEY } from "../constants";
import {
  MD2RSA1, MD4RSAPK, MD5RSA, MD5RSA1, MD_GOST12_512, MD_GOST94, RU, SHA1DSA, SHA1RSA, SHA1RSADI, SHA512RSA, SHARSA, SIGNWITHDIGEST_GOST3410_12_256, SIGNWITHDIGEST_GOST3410_12_512,
} from "../constants";
import {
  DSASHA1, MD2RSA, MD4RSA, MD4RSA1, MD5NOSIGN, MOSAICUPDATEDSIG, RSASSAPSS, SHA1DSA1, SHA1ECDSA, SHA1NOSIGN, SHA256ECDSA, SHA256NOSIGN, SHA256RSA
} from "../constants";
import { SHA384ECDSA, SHA384NOSIGN, SHA384RSA, SHA512ECDSA, SHA512NOSIGN, SPECIFIEDECDSA } from "../constants";
import en from "./EN";
import ru from "./RU";

export default function localize(message: string, locale = EN) {
  const category: string = message.substring(0, message.indexOf("."));
  const field: string = message.substring(message.indexOf(".") + 1, message.length);

  switch (locale) {
    case RU:
      return ru[category][field];
    case EN:
      return en[category][field];
  }
}

localize.contextTypes = {
  locale: PropTypes.string.isRequired,
};

export function localizeAlgorithm(algorithm: string, locale: string) {
  let msg;

  switch (algorithm) {
    case SIGNWITHDIGEST_GOST3410_12_256:
      msg = "Algorithm.id_tc26_signwithdigest_gost3410_12_256";
      break;
    case SIGNWITHDIGEST_GOST3410_12_512:
      msg = "Algorithm.id_tc26_signwithdigest_gost3410_12_512";
      break;
    case GOSTR3411_94_WITH_GOSTR3410_2001:
      msg = "Algorithm.id_GostR3411_94_with_GostR3410_2001";
      break;
    case GOSR3411_94_WITH_GOSTR3410_94:
      msg = "Algorithm.id_GostR3411_94_with_GostR3410_94";
      break;
    case MD_GOST94:
      msg = "Algorithm.id_GostR3411_94";
      break;
    case MD_GOST12_256:
      msg = "Algorithm.id_tc26_gost3411_12_256";
      break;
    case MD_GOST12_512:
      msg = "Algorithm.id_tc26_gost3411_12_512";
      break;
    case GOST3410_12_256:
      msg = "Algorithm.id_tc26_gost3410_12_256";
      break;
    case GOST3410_12_512:
      msg = "Algorithm.id_tc26_gost3410_12_512";
      break;
    case GOST2001:
      msg = "Algorithm.id_GostR3410_2001";
      break;
    case GOST94:
      msg = "Algorithm.id_GostR3410_94";
      break;
    case GOST89:
      msg = "Algorithm.id_Gost28147_89";
      break;
    case SHA1RSADI:
      msg = "Algorithm.id_Sha1rsa_Di";
      break;
    case MD5RSA1:
      msg = "Algorithm.id_MD5_RSA1";
      break;
    case SHA1DSA:
      msg = "Algorithm.id_SHA1_DSA";
      break;
    case SHA1RSA:
      msg = "Algorithm.id_SHA1_RSA";
      break;
    case SHARSA:
      msg = "Algorithm.id_SHA_RSA";
      break;
    case MD5RSA:
      msg = "Algorithm.id_Md5_Rsa";
      break;
    case MD2RSA1:
      msg = "Algorithm.id_Md2_Rsa1";
      break;
    case MD4RSAPK:
      msg = "Algorithm.id_Md4_Rsa_pk";
      break;
    case MD4RSA1:
      msg = "Algorithm.id_Md3Rsa1";
      break;
    case MD4RSA:
      msg = "Algorithm.id_Md4_Rsa";
      break;
    case MD2RSA:
      msg = "Algorithm.id_Md2_Rsa";
      break;
    case SHA1DSA1:
      msg = "Algorithm.id_Sha1_Dsa1";
      break;
    case DSASHA1:
      msg = "Algorithm.id_Dsa_Sha1";
      break;
    case MOSAICUPDATEDSIG:
      msg = "Algorithm.id_Mosaic_update";
      break;
    case SHA1NOSIGN:
      msg = "Algorithm.id_Sha1_No_Sign";
      break;
    case MD5NOSIGN:
      msg = "Algorithm.id_Md5_No_Sign";
      break;
    case SHA256NOSIGN:
      msg = "Algorithm.id_Sha_256_No_Sign";
      break;
    case SHA384NOSIGN:
      msg = "Algorithm.id_Sha384_No_Sign";
      break;
    case SHA512NOSIGN:
      msg = "Algorithm.id_Sha512_No_Sign";
      break;
    case SHA256RSA:
      msg = "Algorithm.id_Sha256_Rsa";
      break;
    case SHA384RSA:
      msg = "Algorithm.id_Sha_384_Rsa";
      break;
    case SHA512RSA:
      msg = "Algorithm.id_Sha_512_Rsa";
      break;
    case RSASSAPSS:
      msg = "Algorithm.id_Rsa_SSAPSS";
      break;
    case SHA1ECDSA:
      msg = "Algorithm.id_Sha1_Ecdsa";
      break;
    case SHA256ECDSA:
      msg = "Algorithm.id_Sha256_Cdsa";
      break;
    case SHA384ECDSA:
      msg = "Algorithm.id_Sha384_Ecdsa";
      break;
    case SHA512ECDSA:
      msg = "Algorithm.id_Sha512_Ecdsa";
      break;
    case SPECIFIEDECDSA:
      msg = "Algorithm.id_Specified_Ecdsa";
      break;
    case RSA:
      msg = "Algorithm.id_Rsa";
      break;
    case DSAKEY:
      msg = "Algorithm.id_Dsakey";
      break;
    case DHKEY:
      msg = "Algorithm.id_Dhkey";
      break;
    case RSASSAPSSKEY:
      msg = "Algorithm.id_Rsa_Ssapkey";
      break;
    case DSA:
      msg = "Algorithm.id_Dsa";
      break;
    case DH:
      msg = "Algorithm.id_Dh";
      break;
    case RSA_KEYX:
      msg = "Algorithm.id_Rsa_key";
      break;
    case mosaicKMandUpdSig:
      msg = "Algorithm.id_mosaic_KMand_Upd_Sig";
      break;
    case ESDH:
      msg = "Algorithm.id_Esdh";
      break;
    case NO_SIGN:
      msg = "Algorithm.id_No_Sign";
      break;
    case ECC:
      msg = "Algorithm.id_Ecc";
      break;
    case ECDSA_P256:
      msg = "Algorithm.id_Ecdsa_P256";
      break;
    case ECDSA_P384:
      msg = "Algorithm.id_Ecdsa_P384";
      break;
    case ECDSA_P521:
      msg = "Algorithm.id_Ecdsa_P521";
      break;
    case RSAES_OAEP:
      msg = "Algorithm.id_Rsaes_Oaep";
      break;
    case ECDH_STD_SHA1_KDF:
      msg = "Algorithm.id_Ecdh_Std_Sha1_Kdf";
      break;
    default:
      return algorithm;
  }

  return localize(msg, locale);
}
