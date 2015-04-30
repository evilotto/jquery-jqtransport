// a jquery transport plug in to support "ajax" querying against
// nodes in the dom
// It recognizes a url starting with "jq:" as a jquery selector
// and returns the html content of that selector
// data-jq-XXX atributes are interpreted as "headers" for the request
(function($) {
	var jqTransport=new Object;
	var jquri="jq:";
	var jqattr="data-jq-";
	jqTransport.transport=function(options, origOptions, jqXHR) {
		if (origOptions.url.substr(0,jquri.length) == jquri) {
			var src=$(origOptions.url.substring(3));
			var rsphdr=[];
			src.each(function(i, el) {
				$.each(el.attributes, function(j, attr) {
					if (attr.name.substr(0,jqattr.length) == jqattr) {
						rsphdr.push(attr.name.substring(8)+": "+attr.value);
					}
				})
			});
			var rsp=src.length > 0 ? src.html() : "";
			return {
				send: function(reqhdr, completeCallback) {
					completeCallback(200,"OK",{html: rsp}, rsphdr.join("\n"));
				},
				abort: function() {}
			}
		}
	};
	$.jqTransport=jqTransport;
	$.ajaxTransport("text",jqTransport.transport);
	return jqTransport;
})(jQuery);

