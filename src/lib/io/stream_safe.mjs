"use strict";

/**
 * Writes data to a stream, automatically waiting for the drain event if asked.
 * See also write_safe.
 * @param	{stream.Writable}			stream_out	The writable stream to write to.
 * @param	{string|Buffer|Uint8Array}	data		The data to write.
 * @return	{Promise}	A promise that resolves when writing is complete.
 * @private
 */
function write_safe(stream_out, data) {
	return new Promise(function (resolve, reject) {
		// Handle errors
		let handler_error = (error) => {
			stream_out.off("error", handler_error);
			reject(error);
		};
		stream_out.on("error", handler_error);
		
		if(typeof data == "string" ? stream_out.write(data, "utf-8") : stream_out.write(data)) {
			// We're good to go
			stream_out.off("error", handler_error);
			resolve();
		}
		else {
			// We need to wait for the drain event before continuing
			stream_out.once("drain", () => {
				stream_out.off("error", handler_error);
				resolve();
			});
		}
	});
}

/**
 * Waits for the given stream to end and finish writing data.
 * NOTE: This function is not tested and guaranteed yet. (ref #10 the HydroIndexWriter bug)
 * @param  {stream.Writable} stream            The stream to end.
 * @param  {Buffer|string} [chunk=undefined] Optional. A chunk to write when calling .end().
 * @return {Promise}                   A Promise that resolves when writing is complete.
 * @private
 */
function end_safe(stream, chunk = undefined) {
	return new Promise((resolve, _reject) => {
		stream.once("finish", resolve);
		if(typeof chunk == "undefined") stream.end();
		else stream.end(chunk);
	});
}

export { write_safe, end_safe };
