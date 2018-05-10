export class AppSettings {
   public static API_ENDPOINT='http://localhost:4000/api/';
   static getToken(): string {
     return JSON.parse(localStorage.getItem('currentUser')).token;
   }
   static getId(): string {
      return JSON.parse(localStorage.getItem('currentUser')).id;
   }
}
