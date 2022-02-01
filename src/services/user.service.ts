import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {CredencialesRepository} from '../repositories';

export class UserService {
  @repository(CredencialesRepository)
  private credencialesRepository: CredencialesRepository
  constructor(
  ) { }

  async ExistUser(identificator: any) {
    if (!identificator)
      throw new HttpErrors[401]("No existe identificador");

    let user = await this.credencialesRepository.findOne({where: {email: identificator}});

    if (!user)
      user = await this.credencialesRepository.findOne({where: {username: identificator}});
    if (!user)
      throw new HttpErrors[401]("Este usuario no existe");

    return user;
  }
}
