namespace my.bookshop;

entity Books {
  key ID : Integer;
  title  : String;
  stock  : Integer;
}

entity Users {
  key ID : Integer;
  name   : String;
  email  : String;
  password  : String;
}
