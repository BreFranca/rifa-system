var numbers = []
function formatName(name) {
    var names = name.split(' ')
    names[0] = names[0].substring(0, 5) + '...'
    names[1] = names[1].substring(names[1].length - 5, names[1].length)
    return names.join(' ')
}
$.ajax({
    url: 'https://rifas-da-brega.firebaseio.com/.json',
    type: "GET",
    success: function (data) {
        numbers = data
        numbers.map(function (number) {
            $('#numbers').append('<div data-number="'+ number.id +'" class="clickable number ' + number.status + '">'+ (number.name ? '<div class="name">Número '+ (formatNumber(number.id)) + ' ' + number.status +' por: '+ (formatName(number.name)) +'</div>' : '') + (formatNumber(number.id)) + '</div>')
        })
        $('#filters .filter.all span').html('(' + numbers.length + ')')
        $('#filters .filter.pago span').html('(' + numbers.filter(function(number) { return number.status === 'pago' }).length + ')')
        $('#filters .filter.reservado span').html('(' + numbers.filter(function(number) { return number.status === 'reservado' }).length + ')')
        $('#filters .filter.livre span').html('(' + numbers.filter(function(number) { return number.status === '' }).length + ')')
    },
    error: function(error) {
        alert("error: "+error);
    }
});

function formatNumber(number) {
    if (number.toString().length === 1) {
        return '00' + number
    } else if (number.toString().length === 2) {
        return '0' + number
    }
    return number
}

var selectedNumbers = []
function formatMessage() {
    return 'Gostaria%20de%20reservar%20os%20n%C3%BAmeros: ' + selectedNumbers.join('%2C%20')
}

$('body').on('click', ".clickable:not('.selected')", function() {
    var number = $(this).attr('data-number')
    if (!selectedNumbers.find(function(n) { return n === Number(number) }) && numbers.find(function(n) { return n.id === Number(number) && n.status === '' })) {
        $(this).addClass('selected')
        if ($('#popup-send').hasClass('hidden')) {
            $('#popup-send').removeClass('hidden')
            $('body').css({ paddingTop: 120 })
        }
        selectedNumbers.push(Number(number))
        selectedNumbers = selectedNumbers.sort(function(a, b){
            return a - b
        });
        $('.selected-numbers').html(selectedNumbers.join(', '))
        $('#popup-send a').attr('href', 'https://api.whatsapp.com/send?phone=5511948774267&text='+ (formatMessage()))
    }
})

$('body').on('click', '.selected', function() {
    $(this).removeClass('selected')
    var number = $(this).attr('data-number')
    selectedNumbers = selectedNumbers.filter(function(n) { return n !== Number(number) })
    if (selectedNumbers.length < 1) {
        $('#popup-send').addClass('hidden')
        $('body').css({ paddingTop: 0 })
    }
    $('.selected-numbers').html(selectedNumbers.join(', '))
    $('#popup-send a').attr('href', 'https://api.whatsapp.com/send?phone=5511948774267&text='+ (formatMessage()))
})

$('.filter').on('click', function(e) {
    var filter = $(this).attr('data-filter')
    $('#filters .filter').removeClass('filter-active')
    $(this).addClass('filter-active')
    $('#numbers .number').addClass('hidden')
    switch (filter) {
        case 'reservado':
            $('#numbers .number.reservado').removeClass('hidden')
            return false
        case 'pago':
            $('#numbers .number.pago').removeClass('hidden')
            return false
        case 'livre':
            $('#numbers .number').removeClass('hidden')
            $('#numbers .number.reservado').addClass('hidden')
            $('#numbers .number.pago').addClass('hidden')
            return false
        default:
            $('#filters .filter').addClass('filter-active')
            $('#numbers .number').removeClass('hidden')
            return false
    }
})