import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { OperationType } from "../../entities/Statement";
import { AppError } from "../../../../shared/errors/AppError";
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
describe("should be able to create a user and a statement", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a new user and stastament", async () => {
    const user: ICreateUserDTO = {
      name: "Mario Becker",
      email: "mario@gmail.com",
      password: "1234",
    };

    const userCreated = await createUserUseCase.execute(user);
    expect(userCreated).toHaveProperty("id");

    const logUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(logUser).toHaveProperty("token");

    const statement: ICreateStatementDTO = {
      user_id: logUser.user.id!,
      amount: 100,
      description: "test",
      type: OperationType.DEPOSIT,
    };

    await createStatementUseCase.execute(statement);

    expect(statement.amount).toBe(100);

    expect(statement.user_id).toBe(logUser.user.id);
  });

  it("should not be able to create statements with invalid user", async () => {
    const statement: ICreateStatementDTO = {
      user_id: "invalid_id",
      amount: 1000,
      description: "test",
      type: OperationType.DEPOSIT,
    };

    await expect(
      createStatementUseCase.execute(statement)
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to withdraw more money than you have", async () => {
    const user: ICreateUserDTO = {
      name: "Mario Becker",
      email: "mario@gmail.com",
      password: "1234",
    };

    const userCreated = await createUserUseCase.execute(user);

    expect(userCreated).toHaveProperty("id");

    const logUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(logUser).toHaveProperty("token");

    expect(async () => {
      const statement: ICreateStatementDTO = {
        user_id: logUser.user.id!,
        amount: 4000,
        description: "test",
        type: OperationType.WITHDRAW,
      };

      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(AppError);
  });
});
