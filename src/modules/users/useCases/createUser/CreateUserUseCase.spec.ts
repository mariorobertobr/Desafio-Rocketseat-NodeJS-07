import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create new User", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });
  it("should be able to create a new user", async () => {
    const user: ICreateUserDTO = {
      name: "Mario Becker",
      email: "mario.roberto@hotmail.com",
      password: "1234",
    };

    const response = await createUserUseCase.execute(user);
    expect(usersRepositoryInMemory.findByEmail(user.email)).toBeTruthy();
    expect(response).toHaveProperty("id");
  });

  it("should not be able to create a new user with an existing email", async () => {
    const user: ICreateUserDTO = {
      name: "Mario Becker",
      email: "mariobr@hotmail.com",
      password: "1234",
    };
    const user_2: ICreateUserDTO = {
      name: "Mario Becker",
      email: "mariobr@hotmail.com",
      password: "1234",
    };
    await createUserUseCase.execute(user);
    await expect(createUserUseCase.execute(user_2)).rejects.toBeInstanceOf(
      AppError
    );
  });
});
