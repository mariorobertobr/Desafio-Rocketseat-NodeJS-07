import { type } from "os";
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("should be able to get a statement", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get a statement", async () => {
    const user: ICreateUserDTO = {
      name: "Mario Becker",
      email: "mario@gmail.com",
      password: "1234",
    };

    const createUser = await createUserUseCase.execute(user);
    expect(createUser).toHaveProperty("id");

    const statement: ICreateStatementDTO = {
      user_id: createUser.id!,
      description: "Salário",
      amount: 1000,
      type: OperationType.DEPOSIT,
    };

    const createStatement = await createStatementUseCase.execute(statement);
    expect(createStatement).toHaveProperty("id");

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: createUser.id!,
      statement_id: createStatement.id!,
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation.amount).toBe(1000);
  });

  it("should not be able to get statament if operation or user do not exist", async () => {
    await expect(
      getStatementOperationUseCase.execute({
        user_id: "invalid_id",
        statement_id: "invalid_id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
