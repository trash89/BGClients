import { faker } from "@faker-js/faker";
const WAIT_TIME = 3000;

describe("Clients tests", function () {
  beforeEach(function () {
    cy.visit("http://localhost:3000");
    cy.url().should("eq", "http://localhost:3000/register");
    cy.get("[id=email]").type("demo@demo.com").should("have.value", "demo@demo.com");
    cy.get("[id=password]").type("secret123").should("have.value", "secret123");
    cy.get("[id=demoapp]").click();
    cy.get(".container > .d-flex").should("contain.text", "Clients list");
  });

  context("Context /clients", () => {
    const email = faker.internet.email();
    const newEmail = faker.internet.email();

    it("create a new client", function () {
      const name = faker.company.name();
      const description = faker.lorem.lines(1);
      const address = faker.address.streetAddress({ useFullAddress: true });

      cy.get("[data-cy='newClient']").click();
      cy.get('[data-cy="email"]').should("have.focus").type(email).should("have.value", email);
      cy.get('[data-cy="name"]').type(name).should("have.value", name);
      cy.get('[data-cy="description"]').type(description).should("have.value", description);
      cy.get('[data-cy="address"]').type(address).should("have.value", address);
      cy.intercept("GET", "**/clients").as("getClients");
      cy.get('[data-cy="save"]').should("be.enabled").click();
      cy.wait("@getClients").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.get('[data-cy="clientsList"]').should("contain.text", email);
    });

    it("edit the new client, change all fields", function () {
      const name = faker.company.name();
      const description = faker.lorem.lines(1);
      const address = faker.address.streetAddress({ useFullAddress: true });

      cy.intercept("GET", "**/clients/*").as("getOneClient");
      cy.get('[data-cy="clientsList"]').contains(email).click();
      cy.wait(WAIT_TIME);
      cy.wait("@getOneClient").its("response.statusCode").should("be.oneOf", [200, 304]);

      cy.get('[data-cy="email"]').as("email").clear().should("be.empty").type(newEmail).should("have.value", newEmail);
      cy.get('[data-cy="name"]').as("name").clear().should("be.empty").type(name).should("have.value", name);
      cy.get('[data-cy="description"]').as("description").clear().should("be.empty").type(description).should("have.value", description);
      cy.get('[data-cy="address"]').as("address").clear().should("be.empty").type(address).should("have.value", address);
      cy.get('[data-cy="save"]').should("be.enabled");
      cy.intercept("GET", "**/clients").as("getNewClients");
      cy.get('[data-cy="save"]').click();
      cy.wait(WAIT_TIME);
      cy.wait("@getNewClients").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.get('[data-cy="clientsList"]').should("contain.text", newEmail);
      cy.get('[data-cy="clientsList"]').should("contain.text", name);
    });

    it("create a new event for the new created client", function () {
      const ev_name = faker.company.name();
      const ev_description = faker.lorem.lines(1);
      const ev_date_gen = faker.date.soon().toISOString();
      const myArray = ev_date_gen.split("T");
      const ev_date = myArray[0];
      cy.intercept("GET", "**/clients/*").as("getOneClient");
      cy.get('[data-cy="clientsList"]').contains(newEmail).click();
      cy.wait(WAIT_TIME);
      cy.wait("@getOneClient").its("response.statusCode").should("be.oneOf", [200, 304]);

      cy.get('[data-cy="newEvent"]').click();
      cy.wait(WAIT_TIME);
      cy.get('[data-cy="ev_date"]').type(ev_date).should("have.value", ev_date);
      cy.get('[data-cy="ev_name"]').type(ev_name).should("have.value", ev_name);
      cy.get('[data-cy="ev_description"]').type(ev_description).should("have.value", ev_description);

      cy.intercept("GET", "**/clients").as("getOneClient");
      cy.get('[data-cy="save"]').should("be.enabled").click();
      cy.wait(WAIT_TIME);
      cy.wait("@getOneClient").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.get('[data-cy="clientsEvents"]').should("contain.text", ev_name);
    });

    it("create a new file for the new created client", function () {
      const file_description = faker.lorem.lines(1);
      cy.intercept("GET", "**/clients/*").as("getOneClient");
      cy.get('[data-cy="clientsList"]').contains(newEmail).click();
      cy.wait(WAIT_TIME);
      cy.wait("@getOneClient").its("response.statusCode").should("be.oneOf", [200, 304]);

      cy.get('[data-cy="newFile"]').click();
      cy.wait(WAIT_TIME);

      cy.fixture("test1.pdf", { encoding: null }).as("myFixture");
      cy.get('[data-cy="file"]').selectFile("@myFixture");
      cy.get('[data-cy="file_description"]').type(file_description).should("have.value", file_description);

      cy.intercept("GET", "**/clients").as("getOneClient");
      cy.get('[data-cy="save"]').should("be.enabled").click();
      cy.wait(WAIT_TIME);
      cy.wait("@getOneClient").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.get('[data-cy="clientsFiles"]').should("contain.text", file_description);
    });

    it("delete the new created client", function () {
      cy.intercept("GET", "**/clients/*").as("getOneClient");
      cy.get('[data-cy="clientsList"]').contains(newEmail).click();
      cy.wait(WAIT_TIME);
      cy.wait("@getOneClient").its("response.statusCode").should("be.oneOf", [200, 304]);

      cy.get('[data-cy="delete"]').should("be.enabled");
      cy.intercept("GET", "**/clients").as("getNewClients");
      cy.get('[data-cy="delete"]').click();
      cy.wait(WAIT_TIME);
      cy.get('[data-cy="confirmDelete"]').click();
      cy.wait(WAIT_TIME);
      cy.wait("@getNewClients").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.get('[data-cy="clientsList"]').should("not.contain.text", newEmail);
    });
  });
});
