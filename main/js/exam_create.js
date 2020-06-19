/* ------------------------------------------------------------------------------
*
*  # Datatables API
*
*  Demo JS code for datatable_api.html page
*
* ---------------------------------------------------------------------------- */

function remove_candidate_from_exam(exam_id, candidate_id) {
    swal({
            title: "Are you sure?",
            text: "This candidate will be removed from the exam!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF5350",
            confirmButtonText: "Yes, remove him!",
            cancelButtonText: "No, cancel pls!",
        },
        function(isConfirm){
            if (isConfirm) {
                let data = new FormData();
                data.append('exam_id', exam_id);
                data.append('candidat_id', candidate_id);
                $.ajax({
                    url: SERVER_URL_PREFIX + '/admin/remove/acndidate/exam',
                    method: 'post',
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        new PNotify({
                            title: 'Deleted successfully!',
                            icon: 'icon-checkmark3',
                            type: 'success'
                        });
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
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
            }
        });
}

function remove_qa_from_exam(exam_id, question_id) {
    swal({
            title: "Are you sure?",
            text: "This question & answers would be removed from the exam!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF5350",
            confirmButtonText: "Yes, remove!",
            cancelButtonText: "No, cancel pls!",
        },
        function(isConfirm){
            if (isConfirm) {
                let data = new FormData();
                data.append('exam_id', exam_id);
                data.append('question_id', question_id);
                $.ajax({
                    url: SERVER_URL_PREFIX + '/examquestion/delete',
                    method: 'post',
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        new PNotify({
                            title: 'Deleted successfully!',
                            icon: 'icon-checkmark3',
                            type: 'success'
                        });
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
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
            }
        });
}

document.addEventListener('DOMContentLoaded', function () {

    let exam_name = '';
    let exam_id = '';
    let qa_array = [];
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

    function init_candidate_table() {
        $('#dt_exam_candidate').DataTable({
            columnDefs: [{
                orderable: false,
                targets: [10]
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

    function init_qa_table() {
        $('#dt_exam_qa').DataTable({
            columnDefs: [{
                orderable: false,
                targets: [8]
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


    // Setup validation
    // ------------------------------

    // Initialize
    let qa_validator = $(".qa-form-validate-jquery").validate({
        ignore: 'input[type=hidden], .select2-search__field', // ignore hidden fields
        errorClass: 'validation-error-label',
        successClass: 'validation-valid-label',
        highlight: function(element, errorClass) {
            $(element).removeClass(errorClass);
        },
        unhighlight: function(element, errorClass) {
            $(element).removeClass(errorClass);
        },

        // Different components require proper error label placement
        errorPlacement: function(error, element) {

            // Styled checkboxes, radios, bootstrap switch
            if (element.parents('div').hasClass("checker") || element.parents('div').hasClass("choice") || element.parent().hasClass('bootstrap-switch-container') ) {
                if(element.parents('label').hasClass('checkbox-inline') || element.parents('label').hasClass('radio-inline')) {
                    error.appendTo( element.parent().parent().parent().parent() );
                }
                else {
                    error.appendTo( element.parent().parent().parent().parent().parent() );
                }
            }

            // Unstyled checkboxes, radios
            else if (element.parents('div').hasClass('checkbox') || element.parents('div').hasClass('radio')) {
                error.appendTo( element.parent().parent().parent() );
            }

            // Input with icons and Select2
            else if (element.parents('div').hasClass('has-feedback') || element.hasClass('select2-hidden-accessible')) {
                error.appendTo( element.parent() );
            }

            // Inline checkboxes, radios
            else if (element.parents('label').hasClass('checkbox-inline') || element.parents('label').hasClass('radio-inline')) {
                error.appendTo( element.parent().parent() );
            }

            // Input group, styled file input
            else if (element.parent().hasClass('uploader') || element.parents().hasClass('input-group')) {
                error.appendTo( element.parent().parent() );
            }

            else {
                error.insertAfter(element);
            }
        },
        validClass: "validation-valid-label",
        success: function(label) {
            label.addClass("validation-valid-label").text("Success.")
        },
        rules: {
            password: {
                minlength: 5
            },
            repeat_password: {
                equalTo: "#password"
            },
            email: {
                email: true
            },
            repeat_email: {
                equalTo: "#email"
            },
            minimum_characters: {
                minlength: 10
            },
            maximum_characters: {
                maxlength: 10
            },
            minimum_number: {
                min: 10
            },
            maximum_number: {
                max: 10
            },
            number_range: {
                range: [10, 20]
            },
            url: {
                url: true
            },
            date: {
                date: true
            },
            date_iso: {
                dateISO: true
            },
            numbers: {
                number: true
            },
            digits: {
                digits: true
            },
            creditcard: {
                creditcard: true
            },
            basic_checkbox: {
                minlength: 2
            },
            styled_checkbox: {
                minlength: 2
            },
            switchery_group: {
                minlength: 2
            },
            switch_group: {
                minlength: 2
            }
        },
        messages: {
            custom: {
                required: 'This is a custom error message'
            },
            basic_checkbox: {
                minlength: 'Please select at least {0} checkboxes'
            },
            styled_checkbox: {
                minlength: 'Please select at least {0} checkboxes'
            },
            switchery_group: {
                minlength: 'Please select at least {0} switches'
            },
            switch_group: {
                minlength: 'Please select at least {0} switches'
            },
            agree: 'Please accept our policy'
        }
    });

    let candidate_validator = $(".candidate-form-validate-jquery").validate({
        ignore: 'input[type=hidden], .select2-search__field', // ignore hidden fields
        errorClass: 'validation-error-label',
        successClass: 'validation-valid-label',
        highlight: function(element, errorClass) {
            $(element).removeClass(errorClass);
        },
        unhighlight: function(element, errorClass) {
            $(element).removeClass(errorClass);
        },

        // Different components require proper error label placement
        errorPlacement: function(error, element) {

            // Styled checkboxes, radios, bootstrap switch
            if (element.parents('div').hasClass("checker") || element.parents('div').hasClass("choice") || element.parent().hasClass('bootstrap-switch-container') ) {
                if(element.parents('label').hasClass('checkbox-inline') || element.parents('label').hasClass('radio-inline')) {
                    error.appendTo( element.parent().parent().parent().parent() );
                }
                else {
                    error.appendTo( element.parent().parent().parent().parent().parent() );
                }
            }

            // Unstyled checkboxes, radios
            else if (element.parents('div').hasClass('checkbox') || element.parents('div').hasClass('radio')) {
                error.appendTo( element.parent().parent().parent() );
            }

            // Input with icons and Select2
            else if (element.parents('div').hasClass('has-feedback') || element.hasClass('select2-hidden-accessible')) {
                error.appendTo( element.parent() );
            }

            // Inline checkboxes, radios
            else if (element.parents('label').hasClass('checkbox-inline') || element.parents('label').hasClass('radio-inline')) {
                error.appendTo( element.parent().parent() );
            }

            // Input group, styled file input
            else if (element.parent().hasClass('uploader') || element.parents().hasClass('input-group')) {
                error.appendTo( element.parent().parent() );
            }

            else {
                error.insertAfter(element);
            }
        },
        validClass: "validation-valid-label",
        success: function(label) {
            label.addClass("validation-valid-label").text("Success.")
        },
        rules: {
            password: {
                minlength: 5
            },
            repeat_password: {
                equalTo: "#password"
            },
            email: {
                email: true
            },
            repeat_email: {
                equalTo: "#email"
            },
            minimum_characters: {
                minlength: 10
            },
            maximum_characters: {
                maxlength: 10
            },
            minimum_number: {
                min: 10
            },
            maximum_number: {
                max: 10
            },
            number_range: {
                range: [10, 20]
            },
            url: {
                url: true
            },
            date: {
                date: true
            },
            date_iso: {
                dateISO: true
            },
            numbers: {
                number: true
            },
            digits: {
                digits: true
            },
            creditcard: {
                creditcard: true
            },
            basic_checkbox: {
                minlength: 2
            },
            styled_checkbox: {
                minlength: 2
            },
            switchery_group: {
                minlength: 2
            },
            switch_group: {
                minlength: 2
            }
        },
        messages: {
            custom: {
                required: 'This is a custom error message'
            },
            basic_checkbox: {
                minlength: 'Please select at least {0} checkboxes'
            },
            styled_checkbox: {
                minlength: 'Please select at least {0} checkboxes'
            },
            switchery_group: {
                minlength: 'Please select at least {0} switches'
            },
            switch_group: {
                minlength: 'Please select at least {0} switches'
            },
            agree: 'Please accept our policy'
        }
    });

    function load_url_param() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get('id');
    }

    function load_exam_data() {
        exam_id = load_url_param();
        if (exam_id) {
            let data = new FormData();
            data.append('exam_id', exam_id);

            // Load candidate data
            $.ajax({
                url: SERVER_URL_PREFIX + '/admin/admit/acndidate/exam/getall',
                method: 'post',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success: function (res) {
                    const { success, exam, candidates } = res;
                    if (success) {
                        exam_name = exam['name'];
                        Object.keys(exam).forEach(key => {
                            if (key === 'starttime') {
                                let date_tag = $('input[name="exam_date"]');
                                let time_tag = $('input[name="exam_time"]');
                                if (date_tag.length > 0) {
                                    date_tag.val(moment(exam[key]).format('yyyy-MM-DD'));
                                }
                                if (time_tag.length > 0) {
                                    time_tag.val(moment(exam[key]).format('HH:mm:ss'));
                                }
                            } else {
                                let input_tag = $('input[name="' + key + '"]');
                                let select_tag = $('select[name="' + key + '"]');
                                if (input_tag.length > 0) {
                                    if (input_tag.attr('type') === 'date') {
                                        input_tag.val(moment(exam[key]).format('yyyy-MM-DD'));
                                    } else {
                                        input_tag.val(exam[key]);
                                    }
                                } else if (select_tag.length > 0) {
                                    select_tag.val(exam[key]);
                                }
                            }
                        });

                        for (let i = 0; i < candidates.length; i++) {
                            const candidate = candidates[i];
                            if (!candidate) {
                                continue;
                            }
                            let html = '<tr>\n' +
                                '                    <td class="text-center">' + candidate['user_id'] + '</td>\n' +
                                '                    <td>' + candidate['candidatecode'] + '</td>\n' +
                                '                    <td>' + candidate['email'] + '</td>\n' +
                                '                    <td>' + candidate['firstname'] + '</td>\n' +
                                '                    <td>' + candidate['lastname'] + '</td>\n' +
                                '                    <td class="text-center">' + candidate['sex'] + '</td>\n' +
                                '                    <td>' + candidate['dateofbirth'] + '</td>\n' +
                                '                    <td>' + candidate['telephone'] + '</td>\n' +
                                '                    <td>' + candidate['address'] + '</td>\n' +
                                '                    <td>' + candidate['cnibnumber'] + '</td>\n' +
                                '                        <td>\n' +
                                '                        <button type="button" class="btn btn-danger btn-xs" ' +
                                '   onclick="remove_candidate_from_exam(' + exam_id + ',' + candidate['id'] + ')">Remove</button>\n' +
                                '                        </td>\n' +
                                '                        </tr>';
                            $('#dt_exam_candidate tbody').append(html);
                        }
                    }
                    init_candidate_table();
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
                    init_candidate_table();
                }
            });

            // Load question & answer data
            $.ajax({
                url: SERVER_URL_PREFIX + '/examquestion/exam',
                method: 'post',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success: function (res) {
                    const { success, data } = res;
                    if (success) {
                        for (let i = 0; i < data.length; i++) {
                            const qaitem = data[i];
                            const css_answer1 = qaitem['answer']['isanser1correct'] == 1 ? 'bg-success-600' : '';
                            const css_answer2 = qaitem['answer']['isanser2correct'] == 1 ? 'bg-success-600' : '';
                            const css_answer3 = qaitem['answer']['isanser3correct'] == 1 ? 'bg-success-600' : '';
                            const css_answer4 = qaitem['answer']['isanser4correct'] == 1 ? 'bg-success-600' : '';

                            qa_array.push({
                                'order': qaitem['order'],
                                'question': qaitem['question']['textquestion'],
                                'answer1': qaitem['answer']['answer1text'],
                                'answer2': qaitem['answer']['answer2text'],
                                'answer3': qaitem['answer']['answer3text'],
                                'answer4': qaitem['answer']['answer4text']
                            });

                            let html = '<tr>\n' +
                                '                    <td class="text-center">' + qaitem['order'] + '</td>\n' +
                                '                    <td class="text-center">' + qaitem['question']['difficulty'] + '</td>\n' +
                                '                    <td>' + qaitem['question']['textquestion'] + '</td>\n' +
                                '                    <td class="' + css_answer1 + '">' + qaitem['answer']['answer1text'] + '</td>\n' +
                                '                    <td class="' + css_answer2 + '">' + qaitem['answer']['answer2text'] + '</td>\n' +
                                '                    <td class="' + css_answer3 + '">' + qaitem['answer']['answer3text'] + '</td>\n' +
                                '                    <td class="' + css_answer4 + '">' + qaitem['answer']['answer4text'] + '</td>\n' +
                                '                    <td>' + (qaitem['question']['active'] == 1 ? 'Yes' : 'No') + '</td>\n' +
                                '                        <td>\n' +
                                '                        <button type="button" class="btn btn-danger btn-xs" ' +
                                '   onclick="remove_qa_from_exam(' + exam_id + ',' + qaitem['question']['id'] + ')">Remove</button>\n' +
                                '                        </td>\n' +
                                '                        </tr>';
                            $('#dt_exam_qa tbody').append(html);
                        }
                    }
                    init_qa_table();
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
                    init_qa_table();
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
    load_exam_data();

    $('#btn_save_exam').click(function () {
        const data = new FormData(document.querySelector('form'));
        let exam_date = $('input[name="exam_date"]').val();
        let exam_time = $('input[name="exam_time"]').val();
        const start_date = moment(exam_date).format('YYYY-MM-DD');
        const start_time = moment(exam_date).format('YYYY-MM-DD') + ' ' + moment(exam_time).format('HH-mm-ss');
        data.append('date', start_date);
        data.append('starttime', start_time);
        $.ajax({
            url: SERVER_URL_PREFIX + '/exams/add',
            method: 'post',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function (res) {
                new PNotify({
                    title: 'Done',
                    text: 'Successfully added Exam!',
                    icon: 'icon-checkmark3',
                    type: 'success'
                });
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

    $('#btn_modify_exam').click(function () {
        const data = new FormData(document.querySelector('form'));
        let exam_date = $('input[name="exam_date"]').val();
        let exam_time = $('input[name="exam_time"]').val();
        const start_date = moment(exam_date).format('YYYY-MM-DD');
        const start_time = moment(exam_date).format('YYYY-MM-DD') + ' ' + moment(exam_time).format('HH-mm-ss');
        data.append('date', start_date);
        data.append('starttime', start_time);
        $.ajax({
            url: SERVER_URL_PREFIX + '/exams/add',
            method: 'post',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function (res) {
                new PNotify({
                    title: 'Done',
                    text: 'Successfully added Exam!',
                    icon: 'icon-checkmark3',
                    type: 'success'
                });
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

    $('#btn_delete_exam').click(function () {
        const exam_id = load_url_param();
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
                                    window.location.href = 'index.html';
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

    $('#btn_save_new_qa').click(function() {
        const question = $('#question_input').val();
        const answer = $('#answer_input').val();

        if (!question || !answer) {
            return;
        }

        if ($('#dt_exam_qa tbody tr.odd').length) {
            $('#dt_exam_qa tbody tr.odd').remove();
        }

        const rows = $('#dt_exam_qa tbody').children().length;
        if (rows > 100) {
            new PNotify({
                title: 'Warning',
                text: 'Can not exceed 100 question & answers',
                icon: 'icon-blocked',
                type: 'error'
            });
            return;
        }
        const html = '<tr>' +
            '<td>' + (rows + 1) + '</td>' +
            '<td>' + question + '</td>' +
            '<td>' + answer + '</td>' +
            '<td><button type="button" class="btn btn-danger btn-xs btn-delete-exam-qa">Delete</button></td>' +
            '</tr>';
        $('#dt_exam_qa tbody').append(html);

        $('#question_input').val('');
        $('#answer_input').val('');
        $('#question_input-error').hide();
        $('#answer_input-error').hide('');

        init_func();

        $('#modal_add_qa').modal('hide');
    });

    $('#btn_save_new_candidate').click(function() {
        const first_name = $('#first_name_input').val();
        const last_name = $('#last_name_input').val();
        const birthday = $('#birthday_input').val();
        const candidate_id = $('#candidate_id_input').val();
        const personal_id = $('#personal_id_input').val();

        if (!first_name || !last_name || !birthday || !candidate_id || !personal_id) {
            return;
        }

        if ($('#dt_exam_candidate tbody tr.odd').length) {
            $('#dt_exam_candidate tbody tr.odd').remove();
        }

        const rows = $('#dt_exam_candidate tbody').children().length;

        const html = '<tr>' +
            '<td>' + (rows + 1) + '</td>' +
            '<td>' + first_name + '</td>' +
            '<td>' + last_name + '</td>' +
            '<td>' + birthday + '</td>' +
            '<td>' + candidate_id + '</td>' +
            '<td>' + personal_id + '</td>' +
            '<td><button type="button" class="btn btn-danger btn-xs btn-delete-exam-candidate">Delete</button></td>' +
            '</tr>';
        $('#dt_exam_candidate tbody').append(html);

        $('#first_name_input').val('');
        $('#last_name_input').val('');
        $('#birthday_input').val('');
        $('#candidate_id_input').val('');
        $('#personal_id_input').val('');

        $('#first_name_input-error').hide();
        $('#last_name_input-error').hide('');
        $('#birthday_input-error').hide('');
        $('#candidate_id_input-error').hide('');
        $('#personal_id_input-error').hide('');

        init_func();

        $('#modal_add_candidate').modal('hide');
    });

    $('#btn_print_autocorrection').click(function () {
        let html = '';
        html = '<div style="text-align: center"><h1>' + exam_name  + '</h1><span>(Exam ID : ' + exam_id + ')</span></div>';

        html += '<p><b><i>Multiple choice questions (1 mark each)</i></b></p>';
        html += '<p>For each of the parts below there are four possible answers A, B, C and D. Choose the one you consider correct and write your answer in front of each question in the answer sheet provided.</p>'

        qa_array.forEach(qa_item => {
            html += `<p>${qa_item['order']}. ${qa_item['question']}<br>`;
            html += `a) ${qa_item['answer1']}<br>`;
            html += `b) ${qa_item['answer2']}<br>`;
            html += `c) ${qa_item['answer3']}<br>`;
            html += `d) ${qa_item['answer4']}<br>`;
            html += `</p>`;
        });

        var mywindow = window.open('', 'PRINT', 'height=400,width=600');

        mywindow.document.write('<html><head><title>' + exam_name  + '</title>');
        mywindow.document.write('</head><body >');
        mywindow.document.write(html);
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/
        mywindow.print();
    });

    $('#btn_print_answer').click(function () {
        let html = '';
        html += `<div style="display: flex; border: 1px solid black;">`;
        html += `<div style="padding: 3px 2px 3px 7px;">`;
        html += `<span style="padding-left: 15px; font-weight: bold; font-size: 14px;">ROLL NO.</span>`;
        html += `<table style="font-size: 18px; width: 160px;"><thead><tr style="height: 20px;">`;
        html += `<th></th>`;
        for (let i = 0; i < 8; i++) {
            html += `<th style="width: 18px; border: 1px solid black;"></th>`;
        }
        html += `</tr></thead>`;
        html += `<tbody>`;
        const num_array = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        num_array.forEach(num => {
            html += `<tr>`;
            html += `<td style="height: 16px; padding-bottom: 0">${num}</td>`;
            for (let i = 0; i < 8; i++) {
                html += `<td style="height: 14px; padding-bottom: 0;"><div style="border-radius: 50%; border: 1px solid black; width: 14px; height: 14px;"></div></td>`;
            }
            html += `</tr>`;
        });
        html += `</tbody>`;
        html += `</table>`;
        html += `</div>`;

        html += `<div style="padding: 3px; border-left: 1px solid black; border-right: 1px solid black; display: flex; flex-direction: column;">`;
        html += `<div style="border-bottom: 1px solid black; display: flex; flex-direction: column;">`;
        html += `<span style="font-weight: bold; font-size: 14px;">INSTRUCTIONS FOR FILLING THE SHEET</span>`;
        html += `<span style="font-size: 13px">1. This sheet should not be folded or crushed.</span>`;
        html += `<span style="font-size: 13px">2. Use only blue/black ball point pen to fill the circles.</span>`;
        html += `<span style="font-size: 13px">3. Use of pencil is strictly prohibited.</span>`;
        html += `<span style="font-size: 13px">4. Circles should be darkened completely and properly.</span>`;
        html += `<span style="font-size: 13px">5. Cutting and erasing on this sheet is not allowed.</span>`;
        html += `<span style="font-size: 13px">6. Do not use any stray marks on the sheet.</span>`;
        html += `<span style="font-size: 13px">7. Do not use marker or white fluid to hide the mark.</span>`;
        html += `</div>`;
        html += `<div style="display: flex; flex: 1;">`;
        html += `<div style="width: 50%; border-right: 1px solid black;">`;
        html += `<span style="font-weight: bold; font-size: 14px;">Candidate Sign</span>`;
        html += `</div>`;
        html += `<div style="width: 50%; margin-left: 2px; border-left: 1px solid black;">`;
        html += `<span style="font-weight: bold; font-size: 14px;">Invigilator Sign</span>`;
        html += `</div>`;
        html += `</div>`;
        html += `</div>`;

        html += `<div style="padding: 3px; display: flex; flex-direction: column;">`;
        html += `<div style="text-align: center; padding: 10px; 5px;">`
        html += `<span style="font-weight: bold; font-size: 22px;">Your Institute Name & Logo</span>`;
        html += `</div>`;
        html += `<div style="text-align: center; flex: 1;">`
        html += `<span style="padding: 2px 5px; display: flex; align-items: center; justify-content: center; 
                            font-weight: bold; font-size: 16px; background-color: #222222; color: white;  
                            border-radius: 10px;">OMR ANSWER SHEET</span>`;
        html += `</div>`;
        html += `<div style="display: flex; flex-direction: column; padding: 4px 6px;">`;
        html += `<div style="display: flex;">`;
        html += `<span style="font-size: 15px;">Name</span>`;
        html += `<div style="flex: 1; border-bottom: 1px solid black; border-bottom-style: dotted;"></div>`
        html += `</div>`;
        html += `<div style="display: flex; padding-top: 5px;">`;
        html += `<span style="font-size: 15px;">Batch</span>`;
        html += `<div style="flex: 1; border-bottom: 1px solid black; border-bottom-style: dotted;"></div>`
        html += `</div>`;
        html += `<div style="display: flex; padding-top: 5px;">`;
        html += `<span style="font-size: 15px;">Mobile No</span>`;
        html += `<div style="flex: 1; border-bottom: 1px solid black; border-bottom-style: dotted;"></div>`
        html += `<span style="font-size: 15px;">Test Date</span>`;
        html += `<div style="flex: 1; border-bottom: 1px solid black; border-bottom-style: dotted;"></div>`
        html += `</div>`;
        html += `</div>`;
        html += `</div>`;

        html += `</div>`;

        html += `<div style="display: flex; padding: 10px; border: 1px solid black; margin-top: 5px;">`;
        const qa_len = qa_array.length;
        const items_per_col = 27;
        for (let i = 0; i < qa_len; i += items_per_col) {
            const items_this_col = Math.min(items_per_col, qa_len - i);
            html += `<table style="font-size: 18px; width: 125px; margin-left: ${i == 0 ? 15 : 55}px;"><thead><tr>`;
            html += `<th style="width: 30px;"></th>`;
            html += `<th style="width: 30px;">A</th>`;
            html += `<th style="width: 30px;">B</th>`;
            html += `<th style="width: 30px;">C</th>`;
            html += `<th style="width: 30px;">D</th>`;
            html += `</tr></thead>`;
            html += `<tbody>`;
            for (let j = 0; j < items_this_col; j++) {
                const qa_item = qa_array[i + j];
                html += `<tr><td style="height: 22px; padding-bottom: 0">${qa_item['order']}</td>`;
                for (let k = 0; k < 4; k ++) {
                    html += `<td style="height: 22px; padding-bottom: 0"><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>`;
                }
                html += `</tr>`;
            }
            html += `</tbody></table>`;
        }
        html += `</div>`;
        var mywindow = window.open('', 'PRINT', 'height=400,width=600');

        mywindow.document.write('<html><head><title>' + exam_name  + '</title>');
        mywindow.document.write('</head><body>');
        mywindow.document.write(html);
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/
        mywindow.print();
    });
});


