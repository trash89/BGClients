describe("Login and Register", function () {
  before(function () {
    cy.visit("http://localhost:3000");
  });
  // after(function () {
  //   cy.get(".dropdown").click();
  //   cy.get(".dropdown-item").should("include.text", "Logout").click();
  // });

  it("goes to /register page", function () {
    cy.url().should("eq", "http://localhost:3000/register");
  });
  it("type demo username/password", function () {
    cy.get("[id=email]").type("demo@demo.com").should("have.value", "demo@demo.com");
    cy.get("[id=password]").type("secret123").should("have.value", "secret123");
    cy.get("[id=demoapp]").click();
  });
});
