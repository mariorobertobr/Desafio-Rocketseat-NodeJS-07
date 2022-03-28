import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("should be able to get the balance of the users", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to get the balance of the users", async () => {
    const user: ICreateUserDTO = {
      name: "Mario Becker",
      email: "mario@gmail.com",
      password: "1234",
    };

    const createUser = await createUserUseCase.execute(user);
    expect(createUser).toHaveProperty("id");

    const statement = await getBalanceUseCase.execute({
      user_id: createUser.id!,
    });

    expect(statement.balance).toBe(0);
    expect(statement).toHaveProperty("balance");
  });
  it("should not be able to get the balance of invalid users", async () => {
    await expect(
      getBalanceUseCase.execute({
        user_id: "invalid_id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
