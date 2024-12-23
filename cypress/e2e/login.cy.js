describe('Login and User Dashboard', () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit('/');
  });

  it('should log in and navigate to the user dashboard', () => {
    // Fill in the login form
    cy.get('input[name="email"]').type('testuser@example.com'); // Replace with a valid email
    cy.get('input[name="password"]').type('password123'); // Replace with a valid password

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Wait for the dashboard to load
    cy.url().should('include', '/dashboard/users');

    // Check if the dashboard is displayed
    cy.contains('Members').should('be.visible');
    cy.contains('Total members:').should('be.visible');
  });

  it('should show an error message for invalid login', () => {
    // Fill in the login form with invalid credentials
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Check for error message
    cy.contains('Failed to login').should('be.visible');
  });
}); 