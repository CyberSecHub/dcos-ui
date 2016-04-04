describe.only('Organization Page', function () {

  context('Components tab [0e0]', function () {

    context('errored', function () {
      beforeEach(function () {
        cy.configureCluster({
          mesos: '1-task-healthy',
          acl: true,
          plugins: 'organization-enabled',
          LDAPUserCreate: 'error'
        })
        .visitUrl({url: '/system/organization', identify: true, logIn: true});
        cy.get('button').contains('Add User').click();
        cy.get('li').contains('Import LDAP User').click();
        cy.get('.modal.form-modal').as('LDAPForm');
      });

      it('should display error message correctly', function () {
        cy.get('@LDAPForm').get('input[name=username]').type('kennytran');
        cy.get('@LDAPForm').within(function () {
          cy.get('.button').contains('+ Add').click();
          cy.get('.form-help-block').contains('No LDAP Configured');
        });
      });
    });

    context('success', function () {
      beforeEach(function () {
        cy.configureCluster({
          mesos: '1-task-healthy',
          acl: true,
          plugins: 'organization-enabled',
          LDAPUserCreate: 'success'
        })
        .visitUrl({url: '/system/organization', identify: true, logIn: true});
        cy.get('button').contains('Add User').click();
        cy.get('li').contains('Import LDAP User').click();
        cy.get('.modal.form-modal').as('LDAPForm');
      });

      it('should display error message correctly', function () {
        cy.get('@LDAPForm').get('input[name=username]').type('kennytran');
        cy.get('@LDAPForm').within(function () {
          cy.get('.button').contains('+ Add').click();
          cy.get('p.text-success').contains('User \'kennytran\' added');
        });
      });
    });

  });
});
