(function ($) {
    $(document).ready(function () {
        $('#fetch').click(function () {
            var stockSymbol = $.trim($('#stock-symbol').val().toUpperCase());

            $.ajax('http://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.quotes where symbol in ("' + stockSymbol + '")&diagnostics=true&env=http://datatables.org/alltables.env', {
                beforeSend: function () {
                    $('#current-stock-price').html('Loading ...');
                },
                success: function (res) {
                    var quote = $(res).find('[symbol="' + stockSymbol + '"]');
                    var lastTradePrice = quote.find('LastTradePriceOnly').text();

                    $('#current-stock-price').html('<strong>' + stockSymbol + '</strong>: $' + lastTradePrice + ' retrieved at ' + new Date().toString());
                    $('#stock-price-log').html($('#stock-price-log').html() + '<li><strong>' + stockSymbol + '</strong> $' + lastTradePrice + ' retrieved at ' + new Date().toString() + '</li>');
                }
            });
        });
    });
})(jQuery);
