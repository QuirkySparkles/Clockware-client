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
            clocksize: ["маленькие", "средние", "большие"],
            times: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
            toEdit: {
                number: 0,
                client_email: "",
                city: "",
                master_id: "",
                clocksize: "",
                order_date: "",
                order_time: ""
            }
        }
    },

    mounted () {
        this.loadData("orders");
    }
}