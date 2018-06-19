import api from "../../services/api.js";
import loadMixin from "./loadMixin.js";

var connection = api();

export default {
    name: "cities",
    mixins: [loadMixin],
    data: function() {
        return {
            newCity: "",
            toDelete: [],
            isCorrect: true,
            visible: false
        }
    },

    methods: {
        addCity: function() {
            var nameTemplate = /^[а-яА-ЯёЁa-zA-Z\- ]*$/;
            if(!this.newCity) {
                this.isCorrect = false;
                return;
            }
            if(this.newCity.length > 15) {
                this.isCorrect = false;
                return;
            }
            if(!this.newCity.match(nameTemplate)) {
                this.isCorrect = false;
                return;
            }
            this.isCorrect = true;
            connection.post("/admin/cities", {number: this.datalist.length + 1, value: this.newCity} )
            .then( response => {
                alert("Новый город добавлен");
                this.newCity = "";
                this.loadData("cities");
            })
            .catch( error => alert(error) )
        },

        deleteCity: function() {
            connection.post("/admin/deldata", { table: "cities", value: this.toDelete })
            .then( response => {
                alert("Выбранные города были удалены");
                this.toDelete = [];
                this.loadData("cities");
            })
            .catch( error => {
                console.log(error);
                alert(error.message);
            });
        }
    },
    mounted () {
        this.loadData("cities");
    }
}