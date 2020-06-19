/* ------------------------------------------------------------------------------
*
*  # Datatables API
*
*  Demo JS code for datatable_api.html page
*
* ---------------------------------------------------------------------------- */

function modify_exam(exam_id) {
    window.location.href = 'exam_modify.html?id=' + exam_id;
}

function duplicate_exam(exam_id) {

}

function print_exam(exam_id) {

}

function delete_exam(exam_id) {
    swal({
            title: "Are you sure?",
            text: "You will not be able to recover this exam!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF5350",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel pls!",
        },
        function(isConfirm){
            if (isConfirm) {
                let data = new FormData();
                data.append('exam_id', exam_id);
                $.ajax({
                    url: SERVER_URL_PREFIX + '/exams/delete',
                    data: data,
                    method: 'post',
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        const { success, message } = res;
                        if (success) {
                            new PNotify({
                                title: message,
                                icon: 'icon-checkmark3',
                                type: 'success'
                            });
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        }
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

    // Table setup
    // ------------------------------

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

    function load_data() {
        $.ajax({
            url: SERVER_URL_PREFIX + '/exams/getall',
            method: 'post',
            cache: false,
            contentType: false,
            processData: false,
            success: function (res) {
                const { success, data } = res;
                if (success === true) {
                    for (let i = 0; i < data.length; i++) {
                        const exam = data[i];
                        let html = '<tr>\n' +
                            '                    <td>' + exam['name'] + '</td>\n' +
                            '                    <td>' + exam['reference'] + '</td>\n' +
                            '                    <td>' + exam['type'] + '</td>\n' +
                            '                    <td>' + exam['starttime'] + '</td>\n' +
                            '                    <td>' + exam['duration'] + '</td>\n' +
                            '                    <td>\n' +
                            '                                <button type="button" class="btn btn-primary btn-xs " onclick="modify_exam(' + exam['id'] + ')">View</button>\n' +
                            '                            </td>\n' +
                            '                            <td>\n' +
                            '                                <button type="button" class="btn btn-danger btn-xs btn-delete-exam" onclick="delete_exam(' + exam['id'] + ')" exam_id="' + exam['id'] + '">Delete</button>\n' +
                            '                            </td>\n';
                            // '                            <td>\n' +
                            // '                                <button type="button" class="btn bg-green btn-xs" onclick="duplicate_exam(' + exam['id'] + ')">Duplicate</button>\n' +
                            // '                            </td>\n' +
                            // '                            <td>\n' +
                            // '                                <button type="button" class="btn bg-brown btn-xs" onclick="print_exam(' + exam['id'] + ')">Print</button>\n' +
                            // '                            </td>';
                        $('#dt_list_exam tbody').append(html);
                    }
                }
                init_table();
                init_func();
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
                init_table();
            }
        })
    }
    load_data();

    function init_table() {
        $('#dt_list_exam').DataTable({
            columnDefs: [{
                orderable: false,
                width: '100px',
                targets: [5]
            }, {
                orderable: false,
                width: '100px',
                targets: [6]
            },
            //     {
            //     orderable: false,
            //     width: '100px',
            //     targets: [7]
            // }, {
            //     orderable: false,
            //     width: '100px',
            //     targets: [8]
            // }
            ],
            // initComplete: function () {
            //     this.api().columns().every(function () {
            //         var column = this;
            //         column.prop('orderable', false);
            //         var select = $('<select class="filter-select" data-placeholder="Filter"><option value=""></option></select>')
            //             .appendTo($(column.footer()).not(':nth-last-child(1),:nth-last-child(2),:nth-last-child(3),:nth-last-child(4)').empty())
            //             .on('change', function () {
            //                 var val = $.fn.dataTable.util.escapeRegex(
            //                     $(this).val()
            //                 );
            //
            //                 column
            //                     .search(val ? '^' + val + '$' : '', true, false)
            //                     .draw();
            //             });
            //
            //         column.data().unique().sort().each(function (d, j) {
            //             select.append('<option value="' + d.replace(/<[^>]+>/g, '') + '">' + d + '</option>')
            //         });
            //     });
            // }
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

    function init_func() {
        $('.btn-duplicate-exam').on('click', function() {
            const rows = $('#dt_list_exam tbody').children().length;
            const cur_row = $(this).parent().parent();
            console.log('cur_row ', cur_row);
            const html = '<tr>' +
                '<td>' + (rows + 1) + '</td>' +
                '<td>' + cur_row.find('>:nth-child(2)').text() + '</td>' +
                '<td>' + cur_row.find('>:nth-child(3)').text() + '</td>' +
                '<td>' + cur_row.find('>:nth-child(4)').text() + '</td>' +
                '<td><button type="button" class="btn btn-primary btn-xs btn-modify-exam">Modify</button></td>' +
                '<td><button type="button" class="btn btn-danger btn-xs btn-delete-exam">Delete</button></td>' +
                '<td><button type="button" class="btn bg-green btn-xs btn-duplicate-exam">Duplicate</button></td>' +
                '<td><button type="button" class="btn bg-brown btn-xs">Print</button></td>' +
                '</tr>';
            $('#dt_list_exam tbody').append(html);

            init_func();
        });
    }
});


