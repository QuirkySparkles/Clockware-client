import api from "../../services/api.js";
import checkAuth from "./checkAuth.js";

var connection = api();

export default {
    name: "admin",
    mixins: [checkAuth],        
    methods: {
        logout: function() {
            document.cookie = "access_token" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            this.$router.go(this.$router.push("/"));
        }
    },
    mounted () {
        this.checkAuth();
    }
}