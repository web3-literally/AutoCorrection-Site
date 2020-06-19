/* ------------------------------------------------------------------------------
*
*  # Datatables API
*
*  Demo JS code for datatable_api.html page
*
* ---------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function () {

    // Checkboxes/radios (Uniform)
    // ------------------------------

    // Default initialization
    $(".styled").uniform();

    function load_url_param() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get('id');
    }

    function load_document() {
        const document_id = load_url_param();
        if (document_id) {
            let data = new FormData();
            data.append('doc_id', document_id);
            $.ajax({
                url: SERVER_URL_PREFIX + '/documentid',
                method: 'post',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success: function (res) {
                    const { success, data } = res;
                    if (data) {
                        Object.keys(data).forEach(key => {
                            let input_tag = $('input[name="' + key + '"]');
                            let select_tag = $('select[name="' + key + '"]');
                            let img_tag = $('img[name="' + key + '"]');
                            if (input_tag.length > 0) {
                                if (input_tag.attr('type') === 'date') {
                                    input_tag.val(moment(data[key]).format('yyyy-MM-DD'));
                                } else {
                                    input_tag.val(data[key]);
                                }
                            } else if (select_tag.length > 0) {
                                select_tag.val(data[key]);
                            } else if (img_tag.length > 0) {
                                img_tag.attr('src', data[key]);
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
    load_document();

    $('#btn_save_document').click(function () {
        const data = new FormData(document.querySelector('form'));
        const iscurrent_checked = $('input[name="_iscurrent"]').attr('checked');
        console.log('iscurrent_checked ', iscurrent_checked);
        data.append('iscurrent', iscurrent_checked ? 0 : 1);
        $.ajax({
            url: SERVER_URL_PREFIX + '/documentid/add',
            method: 'post',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function (res) {
                const { success, message } = res;
                if (success) {
                    new PNotify({
                        text: message,
                        icon: 'icon-checkmark3',
                        type: 'success'
                    });
                    setTimeout(() => {
                        window.location.href = 'documents.html';
                    }, 1000);
                }
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

    $('#btn_delete_document').on('click', function() {
        swal({
                title: "Are you sure?",
                text: "You will not be able to recover this document!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#EF5350",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel pls!",
            },
            function(isConfirm){
                if (isConfirm) {
                    let data = new FormData();
                    data.append('doc_id', load_url_param());
                    $.ajax({
                        url: SERVER_URL_PREFIX + '/documentid/delete',
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
                                    window.location.href = 'documents.html';
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

});


