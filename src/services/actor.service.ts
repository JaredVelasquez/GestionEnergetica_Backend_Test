import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Request, Response} from '@loopback/rest';
import path from 'path';
import {keys} from '../env/interfaces/Servicekeys.interface';
import {ActoresRepository} from '../repositories';
import {ImageService} from "./image.service";

@injectable({scope: BindingScope.TRANSIENT})
export class ActorService {
  constructor(
    @repository(ActoresRepository)
    private actoresRepository: ActoresRepository,
    @service(ImageService)
    private imgService: ImageService
  ) { }

  async uploadPhoto(response: Response, request: Request, route_file: string) {

    const route_image = path.join(__dirname, route_file);


    let res = await this.imgService.StoreFileToPath(route_image, keys.NAME_PROFILE_PHOTO, request, response, keys.EXTENSIONS_IMAGE);

    console.log(res);

    // identificator = await this.imgService.CleanImageIdentificator(identificator);
    // console.log(identificator);



  }
}
