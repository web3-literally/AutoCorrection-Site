/* ------------------------------------------------------------------------------
*
*  # Datatables API
*
*  Demo JS code for datatable_api.html page
*
* ---------------------------------------------------------------------------- */

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

    function load_url_param() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get('id');
    }

    function load_candidate_data() {
        const candidate_id = load_url_param();
        if (candidate_id) {
            let data = new FormData();
            data.append('candidate_id', candidate_id);
            $.ajax({
                url: SERVER_URL_PREFIX + '/candidat',
                method: 'post',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success: function (res) {
                    const { success, data } = res;
                    if (success) {
                        Object.keys(data).forEach(key => {
                            let input_tag = $('input[name="' + key + '"]');
                            let select_tag = $('select[name="' + key + '"]');
                            if (input_tag.length > 0) {
                                if (input_tag.attr('type') === 'date') {
                                    input_tag.val(moment(data[key]).format('yyyy-MM-DD'));
                                } else {
                                    input_tag.val(data[key]);
                                }
                            } else if (select_tag.length > 0) {
                                select_tag.val(data[key]);
                            }
                        });
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
        } else {
            new PNotify({
                title: 'Candidate id is missing!',
                icon: 'icon-blocked',
                type: 'error'
            });
        }
    }
    load_candidate_data();

    function init_func() {
        $('.btn-delete-exam').on('click', function() {
            let current_row = $(this).parent().parent();
            swal({
                    title: "Are you sure?",
                    text: "You will not be able to assign this exam!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#EF5350",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel pls!",
                },
                function(isConfirm) {
                    if (isConfirm) {
                        current_row.remove();

                        let index = 1;
                        $('#dt_candidate_exams tbody').children().each(function() {
                            $(this).find('>:first-child').text(index);
                            index++;
                        });
                        new PNotify({
                            title: 'Deleted successfully!',
                            icon: 'icon-checkmark3',
                            type: 'success'
                        });
                    }
                    else {
                        new PNotify({
                            title: 'Deletion cancelled!',
                            icon: 'icon-blocked',
                            type: 'error'
                        });
                    }
                });
        });
    }

    init_func();

    $('#btn_save_candidate').click(function () {
        const data = new FormData(document.querySelector('form'));

        $.ajax({
            url: SERVER_URL_PREFIX + '/auth/signup',
            method: 'post',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function (res) {
                new PNotify({
                    title: 'Done',
                    text: 'Successfully added Candidat!',
                    icon: 'icon-checkmark3',
                    type: 'success'
                });
                setTimeout(() => {
                    window.location.href = 'candidates.html';
                }, 1000);
            },
            error: function (err) {
                const { success, message, errors } = err.responseJSON;
                if (success === false) {
                    new PNotify({
                        title: message,
                        text: Object.values(errors).join('\n'),
                        icon: 'icon-blocked',
                        type: 'error'
                    });
                }
            }
        });
    });

    $('#btn_modify_candidate').click(function () {
        const data = new FormData(document.querySelector('form'));
        data.append('candidat_id', load_url_param());
        $.ajax({
            url: SERVER_URL_PREFIX + '/candidat/update',
            method: 'post',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function (res) {
                const { success, message } = res;
                if (success) {
                    new PNotify({
                        title: 'Done',
                        text: message,
                        icon: 'icon-checkmark3',
                        type: 'success'
                    });
                    setTimeout(() => {
                        window.location.href = 'candidates.html';
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

    $('#btn_delete_candidate').on('click', function() {
        swal({
                title: "Are you sure?",
                text: "You will not be able to recover this candidate!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#EF5350",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel pls!",
            },
            function(isConfirm){
                if (isConfirm) {
                    let data = new FormData();
                    data.append('candidate_id', load_url_param());
                    $.ajax({
                        url: SERVER_URL_PREFIX + '/candidat/delete',
                        method: 'post',
                        data: data,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function (res) {
                            const { success, message } = res;
                            if (success) {
                                new PNotify({
                                    title: 'Done',
                                    text: message,
                                    icon: 'icon-checkmark3',
                                    type: 'success'
                                });
                                setTimeout(() => {
                                    window.location.href = 'candidates.html';
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
    });

    $('#btn_assign_new_exam').click(function() {
        const exam_id = $('#exam_id_select').val();
        const exam_date = $('#exam_date_input').val();
        const exam_hour = $('#exam_hour_input').val();

        const rows = $('#dt_candidate_exams tbody').children().length;

        const html = '<tr>' +
            '<td>' + (rows + 1) + '</td>' +
            '<td>' + exam_id + '</td>' +
            '<td>' + exam_date + '</td>' +
            '<td>' + exam_hour + '</td>' +
            '<td><button type="button" class="btn btn-danger btn-xs btn-delete-exam">Delete</button></td>' +
            '</tr>';
        $('#dt_candidate_exams tbody').append(html);

        init_func();

        $('#modal_assign_exam').modal('hide');
    });
});


