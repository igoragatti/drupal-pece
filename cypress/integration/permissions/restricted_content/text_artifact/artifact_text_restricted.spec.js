/// <reference types="Cypress" />
/// <reference types="../support" />

Cypress.on('uncaught:exception', (err, runnable) => {
  //@TODO: Remove event error from panels popup, but i could not get error name to create if.
  return false
})

context('Permissions', () => {
  let users = [
    { username:'researcher', role: 'Researcher'},
    { username:'owner', role: 'Researcher'},
    { username:'contributor', role: 'Contributor'},
    { username:'user', role: null},
    { username:'anonymous', role: null}
  ]

  const title = "Restricted Text Artifact cy"
  const path = "/content/restricted-text-artifact-cy"

  describe ('Create contents to tests', () => {
    it('create users: researcher, owner, contributor and user',  () => {
      users.forEach((user) => {
        cy.createUser(user.username, user.role)
      })
    })

    it('create a restricted Text artifact content ', () => {
      cy.login('owner')
      cy.createContent('/node/add/pece-artifact-text', [
        'input[name=title]:type:' + title,
        '#edit-field-pece-contributors-und-0-target-id:type:cy_contributor',
        '#edit-field-permissions-und-restricted:check:restricted'
      ], () => {
        cy.type_tinyMCE('edit-field-pece-crit-commentary-und-0-value', "<p>This text is very important</p>")
        cy.type_tinyMCE('edit-body-und-0-value', "<p>Test restricted Text Artifact content</p>")
      })
    })
  })

  describe('Test restricted Text Artifact', () => {

    it("anonymous user can't access this content", () => {
      cy.testNoAccess(path)
    })

    it('authenticated user can\'t access this content', () => {
      cy.login('user')
      cy.testNoAccess(path)
    })

    it('researcher user can access this content', () => {
      cy.login('researcher')
      cy.testAccess(path)
    })

    it('contributor user can access this content', () => {
      cy.login('contributor')
      cy.testAccess(path)
    })

    it('contributor user can access in panels editor', () => {
      cy.login('contributor')
      cy.visit(path)
      cy.contains('Customize this page').click()
      cy.contains('Save as custom')
      cy.contains('Cancel')
    })

    it('owner can view and edit this content', () => {
      cy.login('owner')
      cy.testAccess(path)
    })
  })

  describe ('Delete contents after tests', () => {
    users.forEach((user) => {
      it('delete user: ' + user.username,  () => {
        cy.deleteUser(user.username)
      })
    })
  })
})
