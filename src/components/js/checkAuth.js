import api from "../../services/api.js";
var connection = api();

var checkAuth = {
    data: function() {
        return {
            isAuthorized: false
        }
    },
    
    methods: {
        checkAuth: function () {
            var token = document.cookie;
            connection({
                method: 'get',
                url: "/admin",
                headers: function() {
                    if(!token) return {};
                    return { Authorization: token };
                }()
            })
            .then( response => this.isAuthorized = true )
            .catch( err => {
                this.isAuthorized = false;
                if(this.$route.path == "/admin")
                    this.$router.go(this.$router.push("/"));
            });
        }
    }
};

export default checkAuth;