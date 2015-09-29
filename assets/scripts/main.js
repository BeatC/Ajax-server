/**
 * Created by beatc on 29.09.15.
 */

(function () {
    $('.send-post').click(function () {
        $.post('/task', {
            name: "Alan"
        }, function (res) {
            console.log('Added successfully');
        });
    });

    $('.send-put').click(function () {
        $.ajax({
            url: '/task',
            type: 'PUT',
            data: {
                id: 2,
                name: 'John'
            },
            success: function (res) {
                console.log("Edited successfully");
            }
        });
    });

    $('.send-delete').click(function () {
        $.ajax({
            url: '/task',
            type: "DELETE",
            data: {
                id: 2
            },
            success: function (res) {
                console.log('Deleted successfully');
            }
        });
    });
})();