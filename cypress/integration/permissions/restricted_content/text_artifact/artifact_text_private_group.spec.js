/// <reference types="Cypress" />
/// <reference types="../support" />

Cypress.on('uncaught:exception', (err, runnable) => {
  //@TODO: Remove event error from panels popup, but i could not get error name to create if.
  return false
})

context('Permissions', () => {
  let users = [
    { username:'researcher', role: 'Researcher'},
    { username:'researcher_group', role: 'Researcher'},
    { username:'owner', role: 'Researcher'},
    { username:'contributor', role: 'Contributor'},
    { username:'user', role: null},
    { username:'anonymous', role: null}
  ]

  const title = "Restricted Text Artifact cy"
  const path = "/content/restricted-text-artifact-cy"
  const publicGroup = 'Public Group Test cy'
  const privateGroup = 'Private Group Test cy'

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

    it('create public group', () => {
      cy.login('admin')
      cy.createContent('/node/add/pece-group', [
        'input[name=title]:type:' + publicGroup
      ], () => {
        cy.addImage('#edit-field-pece-media-image-und-0-upload--widget')
        cy.type_tinyMCE('edit-body-und-0-value', "<p>Test group</p>")
      })
    })

    it('create private group', () => {
      cy.login('admin')
      cy.createContent('/node/add/pece-group', [
        'input[name=title]:type:' + privateGroup,
        '#edit-group-access-und-1:check:1'
      ], () => {
        cy.addImage('#edit-field-pece-media-image-und-0-upload--widget')
        cy.type_tinyMCE('edit-body-und-0-value', "<p>Test group</p>")
      })
    })

    it ('add researcher_group in the content group', () => {
      cy.login('admin')
      cy.updateUser('researcher_group', [
        '#edit-og-user-node-und-0-default:select:' + privateGroup
      ])
    })
  })

  describe('Default Visibility', () => {
    it ('group with default visibility', () => {
      cy.login('admin')
      cy.updateContent(title, [
        '#edit-og-group-ref-und-0-default:select:' + privateGroup
      ])
    })
    it("anonymous user can't access this content", () => {
      cy.testNoAccess(path)
    })

    it('authenticated user can\'t access this content', () => {
      cy.login('user')
      cy.testNoAccess(path)
    })

    it('researcher user can\'t access this content', () => {
      cy.login('researcher')
      cy.testNoAccess(path)
    })

    it('contributor user can access this content', () => {
      cy.login('contributor')
      cy.testAccess(path)
    })

    it('contributor user can access in panels editor', () => {
      cy.login('contributor')
      cy.contains('Customize this page').click()
      cy.contains('Save as custom')
      cy.contains('Cancel')
    })

    it("researcher user can't access this content", () => {
      cy.login('researcher')
      cy.testNoAccess(path)
    })

    it("authenticated user can't access this content", () => {
      cy.login('user')
      cy.testNoAccess(path)
    })

    it("researcher_group in group content can access this content", () => {
      cy.login('researcher_group')
      cy.testAccess(path)
    })

  })
  describe('Public Visibility', () => {
    it("change group visibility TO PUBLIC", () => {
      cy.login('admin')
      cy.updateContent(privateGroup, [
        '#edit-group-content-access-und:select:Public - accessible to all site users'
      ])
    })

    it("anonymous user can't access this content", () => {
      cy.testNoAccess(path)
    })

    it('authenticated user can\'t access this content', () => {
      cy.login('user')
      cy.testNoAccess(path)
    })

    it('contributor user can access this content', () => {
      cy.login('contributor')
      cy.testAccess(path)
    })

    it('contributor user can access in panels editor', () => {
      cy.login('contributor')
      cy.contains('Customize this page').click()
      cy.contains('Save as custom')
      cy.contains('Cancel')
    })

    it('researcher user can access this content', () => {
      cy.login('researcher')
      cy.testAccess(path)
    })

    it("researcher_group in group content can access this content", () => {
      cy.login('researcher_group')
      cy.testAccess(path)
    })
  })

  describe('Private Visibility', () => {
    it ("change group visibility TO PRIVATE", () => {
      cy.login('admin')
      cy.updateContent(privateGroup, [
        '#edit-group-content-access-und:select:Private - accessible only to group members'
      ])
    })
    it("anonymous user can't access this content", () => {
      cy.testNoAccess(path)
    })

    it('authenticated user can\'t access this content', () => {
      cy.login('user')
      cy.testNoAccess(path)
    })

    it('researcher user can\'t access this content', () => {
      cy.login('researcher')
      cy.testNoAccess(path)
    })

    it('contributor user can access this content', () => {
      cy.login('contributor')
      cy.testAccess(path)
    })

    it('contributor user can access in panels editor', () => {
      cy.login('contributor')
      cy.contains('Customize this page').click()
      cy.contains('Save as custom')
      cy.contains('Cancel')
    })

    it("researcher user can't access this content", () => {
      cy.login('researcher')
      cy.testNoAccess(path)
    })

    it("authenticated user can't access this content", () => {
      cy.login('user')
      cy.testNoAccess(path)
    })

    it("researcher_group in group content can access this content", () => {
      cy.login('researcher_group')
      cy.testAccess(path)
    })

    //@TODO: Need test to add two groups, one public and visibility public other private and permission need keep public
  })

  describe ('Delete contents', () => {
    it('delete content and group', () => {
      cy.login('admin')
      cy.deleteContent(title)
      cy.deleteContent(publicGroup)
      cy.deleteContent(privateGroup)
    })
    users.forEach((user) => {
      it('delete user: ' + user.username,  () => {
        cy.deleteUser(user.username)
      })
    })
  })

})
