/* ------------------------------------------------------------------------------
*
*  # Datatables API
*
*  Demo JS code for datatable_api.html page
*
* ---------------------------------------------------------------------------- */

function delete_domain(domain_id) {
    swal({
            title: "Are you sure?",
            text: "You will not be able to recover this domain!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF5350",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel pls!",
        },
        function(isConfirm){
            if (isConfirm) {
                let data = new FormData();
                data.append('domain_id', domain_id);
                $.ajax({
                    url: SERVER_URL_PREFIX + '/domain/delete',
                    method: 'post',
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        window.location.reload();
                    },
                    error: function (err) {
                        const { success, message } = err;
                        if (success === false) {
                            new PNotify({
                                title: message,
                                icon: 'icon-blocked',
                                type: 'error'
                            });
                        }
                    }
                });
            }
        });
}

document.addEventListener('DOMContentLoaded', function () {

    $.ajax({
        url: SERVER_URL_PREFIX + '/domain/getall',
        method: 'post',
        cache: false,
        contentType: false,
        processData: false,
        success: function(res) {
            const { success, data } = res;
            if (success === true) {
                for (let i = 0; i < data.length; i++) {
                    const domain = data[i];
                    let html = '<tr>\n' +
                        '                    <td class="text-center">' + domain['name'] + '</td>\n' +
                        '                    <td>' + domain['exam_id'] + '</td>\n' +
                        '                    <td>' + domain['displayname'] + '</td>\n' +
                        '                    <td>' + domain['description'] + '</td>\n' +
                        '                    <td class="text-center">' + (domain['active'] == 1 ? 'Yes' : 'No') + '</td>\n' +
                        '                        <td>\n' +
                        '                        <button type="button" class="btn btn-danger btn-xs" onclick="delete_domain(' + domain['id'] + ')">Delete</button>\n' +
                        '                        </td>\n' +
                        '                        </tr>';
                    $('#dt_list_domain tbody').append(html);
                }
            }
            init_table();
        },
        error: function(err) {
            console.log(err);
            init_table();
        }
    })

    // Table setup
    // ------------------------------
    function init_table() {
        // Setting datatable defaults
        $.extend($.fn.dataTable.defaults, {
            autoWidth: false,
            columnDefs: [],
            dom: '<"datatable-header"fl><"datatable-scroll"t><"datatable-footer"ip>',
            language: {
                search: '<span>Filter:</span> _INPUT_',
                searchPlaceholder: 'Type to filter...',
                lengthMenu: '<span>Show:</span> _MENU_',
                paginate: {'first': 'First', 'last': 'Last', 'next': $('html').attr('dir') == 'rtl' ? '&larr;' : '&rarr;', 'previous': $('html').attr('dir') == 'rtl' ? '&rarr;' : '&larr;'}
            },
            drawCallback: function () {
                $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').addClass('dropup');
            },
            preDrawCallback: function () {
                $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').removeClass('dropup');
            }
        });

        $('#dt_list_domain').DataTable({
            columnDefs: [{
                width: '130px',
                targets: [1]
            }, {
                width: '130px',
                targets: [4]
            }, {
                orderable: false,
                width: '100px',
                targets: [5]
            }],
        });

        // External table additions
        // ------------------------------

        // Enable Select2 select for the length option
        $('.dataTables_length select').select2({
            minimumResultsForSearch: Infinity,
            width: 'auto'
        });

        // Enable Select2 select for individual column searching
        $('.filter-select').select2();
    }

    $('#btn_save_domain').click(function () {
        const data = new FormData(document.querySelector('form'));

        $.ajax({
            url: SERVER_URL_PREFIX + '/domain/add',
            method: 'post',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function (res) {
                const { success, message } = res;
                if (success) {
                    $('#modal_add_domain').modal('hide');
                    new PNotify({
                        text: message,
                        icon: 'icon-checkmark3',
                        type: 'success'
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            },
            error: function (err) {
                const { success, message } = err.responseJSON;
                if (success === false) {
                    new PNotify({
                        title: message,
                        icon: 'icon-blocked',
                        type: 'error'
                    });
                }
            }
        });
    });
});


