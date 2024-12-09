import request from "supertest";
import app from "..";
import prisma from "../prisma";
import nock from "nock";

describe("GET /api/users", () => {
  const sampleUsers = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@gmail.com",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Dine",
      email: "janedine@gmail.com",
    },
  ];

  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    const user = await prisma.user.findMany();
    if (user.length == 0) {
      await prisma.user.createMany({
        data: sampleUsers,
      });
    }
  });

  afterEach(async () => {
    await prisma.user.deleteMany({ where: {} });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return an array of users", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      message: "ok",
      users: sampleUsers.map((item) => {
        return {
          id: item.id,
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email,
        };
      }),
    });
  });
});

describe("GET /api/pokemons", () => {
  it("should return an array of pokemons", async () => {
    const mockResponse = {
      results: [
        { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
        { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
      ],
    };

    nock("https://pokeapi.co").get("/api/v2/pokemon").reply(200, mockResponse);
    const response = await request(app).get("/api/pokemons");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse.results);
  });
});
