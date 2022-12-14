import { faker } from "@faker-js/faker";
const WAIT_TIME = 3000;

describe("Integration tests", function () {
  beforeEach(function () {
    cy.visit("http://localhost:3000");
    cy.url().should("eq", "http://localhost:3000/register");
    cy.get("[id=email]").type("demo@demo.com").should("have.value", "demo@demo.com");
    cy.get("[id=password]").type("secret123").should("have.value", "secret123");
    cy.get("[id=demoapp]").click();
    cy.get(".container > .d-flex").should("contain.text", "Clients list");
  });

  context("Context integration", () => {
    const email = faker.internet.email();
    let client_id = "";
    const email2 = faker.internet.email();
    let client_id2 = "";
    const newEmail = faker.internet.email();
    const ev_name = faker.random.word();
    const newEv_name = faker.random.word();
    const file_description = faker.lorem.lines(1);
    const newFile_description = faker.lorem.lines(1);
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
      cy.intercept("POST", "**/clients").as("saveClient");
      cy.get('[data-cy="save"]').should("be.enabled").click();
      cy.wait("@saveClient")
        .its("response.body")
        .then((body) => {
          client_id = body.client[0].id;
        });
      cy.wait("@getClients").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.get('[data-cy="clientsList"]').should("contain.text", email);
    });
    it("create a second client", function () {
      const name = faker.company.name();
      const description = faker.lorem.lines(1);
      const address = faker.address.streetAddress({ useFullAddress: true });

      cy.get("[data-cy='newClient']").click();
      cy.get('[data-cy="email"]').should("have.focus").type(email2).should("have.value", email2);
      cy.get('[data-cy="name"]').type(name).should("have.value", name);
      cy.get('[data-cy="description"]').type(description).should("have.value", description);
      cy.get('[data-cy="address"]').type(address).should("have.value", address);
      cy.intercept("GET", "**/clients").as("getClients");
      cy.intercept("POST", "**/clients").as("saveClient");
      cy.get('[data-cy="save"]').should("be.enabled").click();
      cy.wait("@saveClient")
        .its("response.body")
        .then((body) => {
          client_id2 = body.client[0].id;
        });
      cy.wait("@getClients").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.get('[data-cy="clientsList"]').should("contain.text", email2);
    });
    it("edit the first created client, change all fields", function () {
      const name = faker.company.name();
      const description = faker.lorem.lines(1);
      const address = faker.address.streetAddress({ useFullAddress: true });

      cy.intercept("GET", "**/clients/*").as("getOneClient");
      cy.get('[data-cy="clientsList"]').contains(email).click();
      cy.wait(WAIT_TIME);
      cy.wait("@getOneClient").its("response.statusCode").should("be.oneOf", [200, 304]);

      cy.get('[data-cy="email"]').clear().should("be.empty").type(newEmail).should("have.value", newEmail);
      cy.get('[data-cy="name"]').clear().should("be.empty").type(name).should("have.value", name);
      cy.get('[data-cy="description"]').clear().should("be.empty").type(description).should("have.value", description);
      cy.get('[data-cy="address"]').clear().should("be.empty").type(address).should("have.value", address);
      cy.get('[data-cy="save"]').should("be.enabled");
      cy.intercept("GET", "**/clients").as("getNewClients");
      cy.get('[data-cy="save"]').click();
      cy.wait(WAIT_TIME);
      cy.wait("@getNewClients").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.get('[data-cy="clientsList"]').should("contain.text", newEmail);
    });

    it("create a new event for the first created client", function () {
      const ev_description = faker.lorem.lines(1);
      const ev_date_gen = faker.date.soon(2).toISOString();
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

    it("edit the new event, change all fields", function () {
      const ev_description = faker.lorem.lines(1);
      const ev_date_gen = faker.date.soon(3).toISOString();
      const myArray = ev_date_gen.split("T");
      const ev_date = myArray[0];

      cy.intercept("GET", "**/clients/*").as("getOneClient");
      cy.get('[data-cy="clientsList"]').contains(newEmail).click();
      cy.wait(WAIT_TIME);
      cy.wait("@getOneClient").its("response.statusCode").should("be.oneOf", [200, 304]);

      cy.intercept("GET", "**/events/*").as("getOneEvent");
      cy.get('[data-cy="clientsEvents"]').contains(ev_name).click();
      cy.wait(WAIT_TIME);
      cy.wait("@getOneEvent").its("response.statusCode").should("be.oneOf", [200, 304]);

      cy.get('[data-cy="client_id"]').select(`${client_id2}`).should("have.value", `${client_id2}`);
      cy.get('[data-cy="ev_date"]').clear().type(ev_date).should("have.value", ev_date);
      cy.get('[data-cy="ev_name"]').clear().type(newEv_name).should("have.value", newEv_name);
      cy.get('[data-cy="displayed"]').uncheck().should("not.be.checked");
      cy.get('[data-cy="ev_description"]').clear().type(ev_description).should("have.value", ev_description);

      cy.intercept("PATCH", "**/events/*").as("getNewEvent");
      cy.get('[data-cy="save"]').click();
      cy.wait(WAIT_TIME);
      cy.wait("@getNewEvent").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.intercept("GET", "**/clients").as("getOneClient");
      cy.wait(WAIT_TIME);
      cy.wait("@getOneClient").its("response.statusCode").should("be.oneOf", [200, 304]);
      //cy.get('[data-cy="clientsEvents"]').should("contain.text", newEv_name);
    });

    it("delete the event, now it belongs to the second client", function () {
      cy.intercept("GET", "**/clients/*").as("getOneClient");
      cy.get('[data-cy="clientsList"]').contains(email2).click();
      cy.wait(WAIT_TIME);
      cy.wait("@getOneClient").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.intercept("GET", "**/events/*").as("getOneEvent");
      cy.get('[data-cy="clientsEvents"]').contains(newEv_name).click();
      cy.wait(WAIT_TIME);
      cy.wait("@getOneEvent").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.intercept("DELETE", "**/events/*").as("deleteNewEvent");
      cy.get('[data-cy="delete"]').click();
      cy.wait(WAIT_TIME);
      cy.get('[data-cy="confirmDelete"]').click();
      cy.wait(WAIT_TIME);
      cy.wait("@deleteNewEvent").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.intercept("GET", "**/clients").as("getOneClient");
      cy.wait(WAIT_TIME);
      cy.wait("@getOneClient").its("response.statusCode").should("be.oneOf", [200, 304]);
    });

    it("create a new file for the new created client", function () {
      cy.intercept("GET", "**/clients/*").as("getOneClient");
      cy.get('[data-cy="clientsList"]').contains(newEmail).click();
      cy.wait(WAIT_TIME);
      cy.wait("@getOneClient").its("response.statusCode").should("be.oneOf", [200, 304]);

      cy.get('[data-cy="newFile"]').click();
      cy.wait(WAIT_TIME);

      cy.fixture("test1.pdf", { encoding: null }).as("myFixture");
      cy.get('[data-cy="file"]').selectFile("@myFixture");
      cy.wait(WAIT_TIME);
      cy.get('[data-cy="file_description"]').type(file_description).should("have.value", file_description);

      cy.intercept("GET", "**/clients").as("getOneClient");
      cy.get('[data-cy="save"]').should("be.enabled").click();
      cy.wait(WAIT_TIME);
      cy.wait("@getOneClient").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.get('[data-cy="clientsFiles"]').should("contain.text", file_description);
    });

    it("edit the new file", function () {
      cy.intercept("GET", "**/clients/*").as("getOneClient");
      cy.get('[data-cy="clientsList"]').contains(newEmail).click();
      cy.wait(WAIT_TIME);
      cy.wait("@getOneClient").its("response.statusCode").should("be.oneOf", [200, 304]);

      cy.get('[data-cy="clientsFiles"]').should("contain.text", file_description).click();
      cy.wait(WAIT_TIME);

      cy.get('[data-cy="client_id"]').select(`${client_id2}`).should("have.value", `${client_id2}`);
      cy.get('[data-cy="displayed"]').uncheck().should("not.be.checked");
      cy.fixture("test2.pdf", { encoding: null }).as("myFixture");
      cy.get('[data-cy="file"]').selectFile("@myFixture");
      cy.wait(WAIT_TIME);
      cy.get('[data-cy="file_description"]').clear().type(newFile_description).should("have.value", newFile_description);

      cy.intercept("GET", "**/clients").as("getOneClient");
      cy.get('[data-cy="save"]').should("be.enabled").click();
      cy.wait(WAIT_TIME);
      cy.wait("@getOneClient").its("response.statusCode").should("be.oneOf", [200, 304]);
      //cy.get('[data-cy="clientsFiles"]').should("contain.text", newFile_description);
    });
    it("delete the file, now it belongs to the second client", function () {
      cy.intercept("GET", "**/clients/*").as("getOneClient");
      cy.get('[data-cy="clientsList"]').contains(email2).click();
      cy.wait(WAIT_TIME);
      cy.wait("@getOneClient").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.get('[data-cy="clientsFiles"]').should("contain.text", newFile_description).click();
      cy.wait(WAIT_TIME);
      cy.intercept("DELETE", "**/userfiles/*").as("deleteFile");
      cy.get('[data-cy="delete"]').click();
      cy.wait(WAIT_TIME);
      cy.get('[data-cy="confirmDelete"]').click();
      cy.wait(WAIT_TIME);
      cy.wait("@deleteFile").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.intercept("GET", "**/clients").as("getOneClient");
      cy.wait(WAIT_TIME);
      cy.wait("@getOneClient").its("response.statusCode").should("be.oneOf", [200, 304]);
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
    it("delete the second client", function () {
      cy.intercept("GET", "**/clients/*").as("getOneClient");
      cy.get('[data-cy="clientsList"]').contains(email2).click();
      cy.wait(WAIT_TIME);
      cy.wait("@getOneClient").its("response.statusCode").should("be.oneOf", [200, 304]);
      cy.get('[data-cy="delete"]').should("be.enabled");
      cy.intercept("GET", "**/clients").as("getNewClients");
      cy.get('[data-cy="delete"]').click();
      cy.wait(WAIT_TIME);
      cy.get('[data-cy="confirmDelete"]').click();
      cy.wait(WAIT_TIME);
      cy.wait("@getNewClients").its("response.statusCode").should("be.oneOf", [200, 304]);
      //cy.get('[data-cy="clientsList"]').should("not.contain.text", email2);
    });
  });
});
