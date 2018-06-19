import axios from 'axios';
import masterlist from "./masterlist.vue";
import adminform from "./adminform.vue";
import api from "../services/api.js";
import checkAuth from "./js/checkAuth.js";

function InputError(property) {
    Error.call(this, property);
    this.name = "InputError";
    this.property = property;
    this.message = "Ошибка при заполнении формы";
    this.stack = (new Error()).stack;
}
InputError.prototype = Object.create(Error.prototype);

var connection = api();

export default {
    name: "app",
    mixins: [checkAuth],
    data: function() {
        return {
            name: '',
            email: '',
            clocksize: 'small',
            cities: ['Днепр', 'Ужгород'],
            city: 'Днепр',
            orderDate: '',
            times: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
            orderTime: '10:00',
            masterId: '',
            maslist: [],
            invisible: false,
            disabled: false,
            isActive: false,
            isDone: false,
            nameWarning: false,
            emailWarning: false,
            dateWarning: false
        }
    },

    components: {
        masterlist,
        adminform
    },

    methods: {
        clean: function() {
            this.$refs.cleanState.isEmpty = false;
            this.$refs.cleanState.logWarning = false;
        },

        loadCities: function() {
            connection.get("/loadcity")
                .then(response => {
                    this.cities = response.data;
                })
                .catch( error => alert(error.message));
        },

        checkName: function() {
            var template = /^[A-Za-zА-Яа-яёЁ\- ]+$/;
            if(this.name.length < 3 || this.name.length > 30 || !this.name.match(template)) {
                this.nameWarning = true;
                throw new InputError('name');
                return false;
            }
            this.nameWarning = false;
            return true;
        },

        checkEmail: function() {
            var template = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;
            if(this.email.length < 7 || this.email.length > 30 || !this.email.match(template) ) {
                this.emailWarning = true;
                throw new InputError('email');
                return false;
            }
            this.emailWarning = false;
            return true;
        },

        checkDate: function() {
            var today = new Date();
            if((this.orderDate.slice(0, 4) - today.getFullYear()) > 1) {
                throw new InputError('date');
                return false;
            }
            var userDate =
                Date.parse(`${this.orderDate}T${this.orderTime}:00.000+03:00`);
            if(userDate - Date.now() < 0 || this.orderDate.length == 0) {
                throw new InputError('date');
                return false;
            }
            return true;
        },

        checkAvailability: function() {
            try {
                if(this.checkDate()) {
                    var requiredData = {
                        clocksize: this.clocksize,
                        city: this.city,
                        orderDate: this.orderDate,
                        orderTime: this.orderTime
                    }
                    this.dateWarning = false;
                    connection.post("/check", requiredData)
                        .then(response => {
                            if(response.data[0]) {
                                this.maslist = [];
                                this.maslist = response.data;
                                this.invisible = false;
                            }
                            else {
                                this.invisible = true;
                                this.maslist = [];
                            }
                        })
                        .catch( error => {
                            console.log(error);
                            alert("Ошибка при обращении к базе данных, попробуйте ещё раз позже.");
                        });
                    }
                }
            catch(err) {
                if(err.property == "date")
                    this.dateWarning = true;
                else 
                    alert('A global error occured:' + err.property + ' ' + err.stack);
            }
        },

        chooseId: function(value) {
            this.masterId = value;
        },

        toAdmin: function() {
            this.$router.go(this.$router.push("/admin")); 
        },

        sendData: function() {
            try {
                if(this.checkName() && this.checkEmail() && this.checkDate()) {
                    this.nameWarning = false;
                    this.emailWarning = false;
                    this.dateWarning = false;
                    var client = {
                        name: this.name,
                        email: this.email,
                        clocksize: this.clocksize,
                        city: this.city,
                        orderDate: this.orderDate,
                        orderTime: this.orderTime,
                        masterId: this.masterId
                    }
                    this.disabled = true;
                    connection.post("/register", client)
                        .then(response => {
                            this.isDone = true;
                    })
                        .catch( error => {
                            this.disabled = false;
                            if(error.response) {
                                if(error.response.status == 400)
                                    this.emailWarning = true;
                                else(error.response.status == 500)
                                    alert("Ошибка при обращении к базе данных, попробуйте ещё раз позже.");
                            }
                        });
                    }
                }
            catch(err) {
                if(err.property == "name")
                    this.nameWarning = true;
                else if(err.property == "date")
                    this.dateWarning = true;
                else if(err.property == "email")
                    this.emailWarning = true;
                else 
                    alert('A global error occured:' + err.property + ' ' + err.stack);
            }
        }
    },

    mounted () {
        this.checkAuth();
        this.loadCities();
    }
}