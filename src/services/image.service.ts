import { /* inject, */ BindingScope, injectable} from '@loopback/core/dist';
import {HttpErrors, Request, Response} from '@loopback/rest';
import multer from "multer";
import path from "path";
import {keys} from '../env/interfaces/Servicekeys.interface';
const cloudinary = require('cloudinary');

@injectable({scope: BindingScope.TRANSIENT})
export class ImageService {

  async CleanImageIdentificator(identificator: string) {
    identificator = identificator.replace('.jpg', '');
    identificator = identificator.replace('.jpeg', '');
    identificator = identificator.replace('.png', '');
    identificator = identificator.replace('.svg', '');

    return identificator;
  }

  /**
   *
   * @param path
   */
  GetMulterStorageConfig(path: string) {
    var filename: string = '';
    const storage = multer.diskStorage({
      destination: function (req: any, file: any, cb: any) {
        cb(null, path)
      },
      filename: function (req: any, file: any, cb: any) {
        filename = file.originalname
        cb(null, filename);
      }
    });
    return storage;
  }

  /**
   *
   * @param storePath
   */
  StoreFileToPath(storePath: string, fieldname: string, request: Request, response: Response, acceptedExt: string[]): Promise<object> {

    return new Promise<object>((resolve, reject) => {
      const storage = this.GetMulterStorageConfig(storePath);
      const upload = multer({
        storage: storage,
        fileFilter: function (req: any, file: any, callback: any) {
          var ext = path.extname(file.originalname).toUpperCase();
          if (acceptedExt.includes(ext)) {
            return callback(null, true);
          }
          return callback(new HttpErrors[400]('El formato del archivo no es permitido.'));
        },
        limits: {
          fileSize: keys.MAX_WIDTH_IMAGE
        }
      },
      ).single(fieldname);
      upload(request, response, (err: any) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }
}
