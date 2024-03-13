using my.bookshop as my from '../db/data-model';

service CatalogService {
    entity Books as projection on my.Books;
    entity Users as projection on my.Users;

function test() returns String;
function addUser() returns String;
function fetchUserData() returns String;
}
