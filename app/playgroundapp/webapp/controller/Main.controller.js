sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v4/ODataModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ODataModel) {
        "use strict";

        return Controller.extend("playgroundapp.playgroundapp.controller.Main", {
            onInit: function () {
                // Define the URL of your OData service
                var sServiceUrl = "/odata/v4/catalog/"; // Adjust the URL as per your service endpoint

                // Create the OData model
                var oModel = new ODataModel({
                    serviceUrl: sServiceUrl,
                    synchronizationMode: "None",
                });

                // Set the model to the view
                this.getView().setModel(oModel);
            },
            onRefreshTable: function() {
                // Assuming 'Table' is your SAPUI5 Table control instance
                var oTable = this.getView().byId("userTable"); // Replace "userTable" with the actual ID of your table
                var oModel = oTable.getModel();
                
                // Refresh the model data
                oModel.refresh();
            },
            onAddUser: function() {
                // Retrieve values from the sign-up form
                var nameInput = this.getView().byId("nameInput");
                var emailInput = this.getView().byId("emailInput");
                var passwordInput = this.getView().byId("passwordInput");
                
                var name = nameInput.getValue();
                var email = emailInput.getValue();
                var password = passwordInput.getValue();
            
                // Get the last user ID
                this.getLastUserID()
                    .then(lastUserID => {
                        // Create a new user object with the retrieved data
                        var userData = {
                            ID: lastUserID + 1, // Assuming you want to increment the last ID by 1
                            name: name,
                            email: email,
                            password: password
                        };
            
                        // Send an HTTP POST request to the service endpoint
                        fetch('/odata/v4/catalog/Users', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(userData)
                        })
                        .then(response => response.text())
                        .then(message => {
                            console.log('Success:', message);
                            swal("Success");
                            this.onRefreshTable(); // Call the refresh function
            
                            // Clear the sign-up form
                            nameInput.setValue("");
                            emailInput.setValue("");
                            passwordInput.setValue("");
                            
                            // Handle success, for example, show a success message to the user
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            // Handle error, for example, show an error message to the user
                        });
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        // Handle error, for example, show an error message to the user
                    });
            },
            getLastUserID: function() {
                return fetch('/odata/v4/catalog/Users?$orderby=ID desc&$top=1')
                    .then(response => response.json())
                    .then(data => {
                        if(data && data.value && data.value.length > 0) {
                            var lastUserID = data.value[0].ID;
                            console.log('Last User ID:', lastUserID);
                            return lastUserID;
                        } else {
                            console.log('No users found.');
                            return null;
                        }
                    });
            },
            onRemoveUser: function(id) {
                console.log(id)
                if (id) {
                    // Send an HTTP DELETE request to remove the user
                    fetch('/odata/v4/catalog/Users(' + id + ')', {
                        method: 'DELETE'
                    })
                    .then(response => response.text())
                    .then(message => {
                        console.log('Success:', message);
                        swal("User removed successfully");
                        this.onRefreshTable(); // Refresh the table after removing the user
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        // Handle error, for example, show an error message to the user
                    });
                } else {
                    // Handle case where no user ID is found
                    console.log('No user ID found.');
                }
            },            
            onFetchUserData: function() {
                // Send an HTTP GET request to the service endpoint
                fetch('/odata/v4/catalog/fetchUserData()')
                .then(response => response.json())
                .then(data => {
                    console.log('User data:', data);
                    // Process the response data, for example, update the UI with the fetched data
                })
                .catch(error => {
                    console.error('Error:', error);
                    // Handle error, for example, show an error message to the user
                });
            },
            onOpenDialog: function(id) {
                // Log the provided ID to ensure it's received correctly
                console.log("Opening dialog for ID:", id);
            
                // Fetch user data using the provided ID
                this.onFetchUserDataById(id)
            },
            onCloseDialog() {
                // note: We don't need to chain to the pDialog promise, since this event handler
                // is only called from within the loaded dialog itself.
                this.byId("EditDialog").close();
            },
            onFetchUserDataById: function(id) {
                if (id) {
                    // Send an HTTP GET request to retrieve user data
                    fetch('/odata/v4/catalog/Users(' + id + ')')
                        .then(response => {
                            if (!response.ok) {
                                throw new Error("Failed to fetch user data");
                            }
                            return response.json();
                        })
                        .then(userData => {

                            this.openDialogWithData(userData);
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            // Handle error, for example, show an error message to the user
                        });
                } else {
                    // Handle case where no user ID is found
                    console.log('No user ID found.');
                }
            },
            openDialogWithData: function(userData) {
                this.pDialog ??= this.loadFragment({
                    name: "playgroundapp.playgroundapp.view.EditUser"
                });
            
                this.pDialog.then((oDialog) => {
                    // Create a JSON model with the user data
                    var oModel = new sap.ui.model.json.JSONModel(userData);
                    
                    // Set the model to the fragment
                    oDialog.setModel(oModel);
            
                    // Bind the controls in the fragment to the model properties
                    oDialog.bindElement("/");
            
                    // Open the dialog
                    oDialog.open();
                });
            }
        });
    });
