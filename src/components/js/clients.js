import api from "../../services/api.js";
import loadMixin from "./loadMixin.js";

var connection = api();

export default {
    name: "clients",
    mixins: [loadMixin],
    data: function() {
        return {
            toDelete: [],
            number: 0,
            clocksize: ["маленькие", "средние", "большие"],
            toEdit: {
                number: 0,
                name: "",
                email: "",
                clocksize: "",
                city: "",
                order_date: ""
            }
        }
    },

    mounted () {
        this.loadData("clients");
    }
}