import { NewUserI, UserI, UserQuery } from '../models/users/users.interface';
import { UserFactoryDAO } from '../models/users/users.factory';
import { TipoPersistencia } from '../models/users/users.factory';
import { productsCarAPI } from './productscar';
/**
 * Con esta variable elegimos el tipo de persistencia
 */
const tipo = TipoPersistencia.MongoAtlas;

class User {
  private users;

  constructor() {
    this.users = UserFactoryDAO.get(tipo);
  }

  async getUsers(id?: string): Promise<UserI[]> {
    if (id) return this.users.get(id);

    return this.users.get();
  }

  async addUser(productData: NewUserI): Promise<UserI> {
    console.log("hola2");
    const newUser = await this.users.add(productData);
    await productsCarAPI.createCar(newUser._id);
    return newUser;
  }

  async updateUser(id: string, userData: NewUserI) {
    const updatedUser = await this.users.update(id, userData);
    return updatedUser;
  }

  async deleteUser(id: string) {
    await this.users.delete(id);
    //Borrar carrito tambien
  }

  async query(username?: string, email?: string): Promise<UserI> {
    try{
      const query = {
        $or: [] as UserQuery[],
      };

      if (username) query.$or.push({ username });

      if (email) query.$or.push({ email });

      return this.users.query(query);
    }catch(err){
      throw err;
    }  
  }

  async ValidatePassword(username: string, password: string) {
    return this.users.validateUserPassword(username, password);
  }
}

export const UserAPI = new User();
