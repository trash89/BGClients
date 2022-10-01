import { faker } from "@faker-js/faker";
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
    const name = faker.company.name();
    const description = faker.lorem.lines(1);
    const email = faker.internet.email();
    const address = faker.address.streetAddress({ useFullAddress: true });
    const newEmail = faker.internet.email();
    const newName = faker.company.name();
    it("create a new client", function () {
      cy.get("span > .btn").should("have.attr", "title", "Create a new row");
      cy.get("[id=newRow]").click();
      cy.get("#email").should("have.id", "email").should("have.focus");
      cy.get("#email").type(email).should("have.value", email);
      cy.get("#name").type(name).should("have.value", name);
      cy.get("#description").type(description).should("have.value", description);
      cy.get("#address").type(address).should("have.value", address);
      cy.intercept("GET", "**/clients").as("getClients");
      cy.get('[title="Save"]').should("be.enabled").click();
      cy.wait("@getClients").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.get('[data-test="clientsList"]').should("contain.text", email);
    });

    it("edit the new client, change email", function () {
      cy.intercept("GET", "**/clients/*").as("getOneClient");
      cy.get('[data-test="clientsList"]').contains(email).click();
      cy.wait("@getOneClient").its("response.statusCode").should("be.oneOf", [200, 304]);

      cy.get('input[name="email"]').as("email");
      cy.get('input[name="email"]').clear();
      cy.get('input[name="email"]').should("be.empty");
      cy.get('input[name="email"]').type(newEmail);
      cy.get('input[name="email"]').should("have.value", newEmail);

      cy.get('[title="Save"]').should("be.enabled");
      cy.intercept("GET", "**/clients").as("getNewClients");
      cy.get('[title="Save"]').click();
      cy.wait("@getNewClients").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.get('[data-test="clientsList"]').should("contain.text", newEmail);
    });

    it("edit the new client, change name", function () {
      cy.intercept("GET", "**/clients/*").as("getOneClient");
      cy.get('[data-test="clientsList"]').contains(newEmail).click();
      cy.wait("@getOneClient").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.get('input[name="name"]').as("name");
      cy.get('input[name="name"]').as("name").clear();
      cy.get('input[name="name"]').as("name").should("be.empty");
      cy.get('input[name="name"]').as("name").type(newName);
      cy.get('input[name="name"]').as("name").should("have.value", newName);
      cy.get('[title="Save"]').should("be.enabled");
      cy.intercept("GET", "**/clients").as("getNewClients");
      cy.get('[title="Save"]').click();
      cy.wait("@getNewClients").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.get('[data-test="clientsList"]').should("contain.text", newName);
    });
  });
});
