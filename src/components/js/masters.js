import api from "../../services/api.js";
import loadMixin from "./loadMixin.js";

var connection = api();

export default {
    name: "reservations",
    mixins: [loadMixin],
    data: function() {
        return {
            toDelete: [],
            number: 0,
            ratings: [0, 1, 2, 3, 4, 5],
            toEdit: {
                id: 0,
                name: "",
                surname: "",
                city: "",
                rating: ""
            },
            toAdd: {
                number: 0,
                id: "",
                name: "",
                surname: "",
                city: "",
                rating: ""
            },
            showForm: false
        }
    },

    methods: {            
        addMaster: function() {
            if(!this.checkChanges(this.toAdd)) return;
            this.errorField = '';
            this.toAdd.number = this.datalist.length + 1;
            connection.post("/admin/addmaster", this.toAdd)
            .then( response => {
                alert("Новый мастер добавлен");
                for(var key in this.toAdd) {
                    this.toAdd[key] = "";
                }
                this.toAdd.number = 0;
                this.loadData("masters");
            })
            .catch( error => {
                console.log(error);
                alert(error.message);
            })
        }
    },

    mounted () {
        this.loadData("masters");
    }
}