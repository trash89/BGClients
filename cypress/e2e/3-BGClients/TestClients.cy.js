import { faker } from "@faker-js/faker";
const WAIT_TIME = 2000;
describe("Login and Register", function () {
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

      cy.get("[data-cy='newRow']").click();
      cy.get('[data-cy="email"]').should("have.focus").type(email).should("have.value", email);
      cy.get('[data-cy="name"]').type(name).should("have.value", name);
      cy.get('[data-cy="description"]').type(description).should("have.value", description);
      cy.get('[data-cy="address"]').type(address).should("have.value", address);
      cy.intercept("GET", "**/clients").as("getClients");
      cy.get('[data-cy="save"]').should("be.enabled").click();
      cy.wait("@getClients").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.get('[data-cy="clientsList"]').should("contain.text", email);
    });

    it("edit the new client, change all", function () {
      const newName = faker.company.name();
      const newDescription = faker.lorem.lines(1);
      const newAddress = faker.address.streetAddress({ useFullAddress: true });

      cy.intercept("GET", "**/clients/*").as("getOneClient");
      cy.get('[data-cy="clientsList"]').contains(email).click();
      cy.wait(WAIT_TIME);
      cy.wait("@getOneClient").its("response.statusCode").should("be.oneOf", [200, 304]);

      cy.get('[data-cy="email"]').as("email").clear().should("be.empty").type(newEmail).should("have.value", newEmail);
      cy.get('[data-cy="name"]').as("name").clear().should("be.empty").type(newName).should("have.value", newName);
      cy.get('[data-cy="description"]').as("description").clear().should("be.empty").type(newDescription).should("have.value", newDescription);
      cy.get('[data-cy="address"]').as("address").clear().should("be.empty").type(newAddress).should("have.value", newAddress);
      cy.get('[data-cy="save"]').should("be.enabled");
      cy.intercept("GET", "**/clients").as("getNewClients");
      cy.get('[data-cy="save"]').click();
      cy.wait(WAIT_TIME);
      cy.wait("@getNewClients").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.get('[data-cy="clientsList"]').should("contain.text", newEmail);
      cy.get('[data-cy="clientsList"]').should("contain.text", newName);
    });

    it("delete the new client", function () {
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
