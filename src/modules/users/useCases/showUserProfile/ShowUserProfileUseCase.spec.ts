import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("it should be able to review his own user info", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to review his own user info", async () => {
    const user: ICreateUserDTO = {
      name: "Mario Becker",
      email: "mario@hotmail.com",
      password: "1234",
    };

    const createUser = await createUserUseCase.execute(user);
    expect(createUser).toHaveProperty("id");

    //simbolo de interrogação forças que não vai vir undefined no usuario
    const showUserProfile = await showUserProfileUseCase.execute(
      createUser.id!
    );

    expect(showUserProfile).toHaveProperty("id");
  });

  it("should not be able to review other user info", async () => {
    const user: ICreateUserDTO = {
      name: "Mario Becker",
      email: "mario@gmail.com",
      password: "1234",
    };

    const createUser = await createUserUseCase.execute(user);

    await expect(showUserProfileUseCase.execute("123")).rejects.toBeInstanceOf(
      AppError
    );
  });
});
