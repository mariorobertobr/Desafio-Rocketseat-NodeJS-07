import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });
  it("should be able to authenticate a user ", async () => {
    const user: ICreateUserDTO = {
      name: "Mario Becker",
      email: "mariobr@gmail.com",
      password: "1234",
    };

    const createUser = await createUserUseCase.execute(user);

    const logUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });
    // console.log(logUser);

    expect(logUser).toHaveProperty("token");
  });

  it("should be not able to log with wrong email or password or invalid user", async () => {
    const user: ICreateUserDTO = {
      name: "Mario Becker",
      email: "mario@gmail.com",
      password: "1234",
    };

    const createUser = await createUserUseCase.execute(user);

    expect(createUser).toHaveProperty("id");

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);

    // same but with email now

    await expect(
      authenticateUserUseCase.execute({
        email: "mario",
        password: "1234",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
