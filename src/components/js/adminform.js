import api from "../../services/api.js";

var connection = api();

export default {
    name: "adminform",
    data: function() {
        return {
            login: "",
            password: "",
            logWarning: false,
            isEmpty: false
        }
    },

    props: ['isActive'],

    methods: {
        authorize: function() {
            if(!this.login || !this.password) {
                this.isEmpty = true;
                this.logWarning = false;
                return;
            }
            this.isEmpty = false;
            connection({
                url: '/auth',
                method: 'post',
                data: {
                    login: this.login,
                    password: this.password
                },
                withCredentials: true
            })
            .then(response => {
                if(response.status == 200)
                    this.$router.go(this.$router.push("/admin"));
            })
            .catch( error => {
                if(error.response) {
                    if(error.response.status === 400) {
                        this.login = "";
                        this.password = "";
                        this.logWarning = true;
                    }
                    else alert("Произошла ошибка на сервере, попробуйте повторить запрос позже.");
                }
                else alert("Произошла ошибка на сервере, либо же возникли проблемы с соединением.");
            });
        }
    }
}