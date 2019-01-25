// 通用工具
LZR.load([
	"LZR.HTML.Base.Ajax",
	"LZR.HTML.Util.Finger"
]);

var lzr_tools = {
	// 指纹跟踪
    trace: function () {
		lzr_tools.getNetIP(function(o) {
			if (!o) {o = {};}
			var ajx = new LZR.HTML.Base.Ajax ();
			lzr_tools.getUserIP(function (uip) {
				if (uip) {
					if (o.userIP) {
						o.userIP += "," + uip;
					} else {
						o.userIP = uip;
					}
				}
				o.url = window.location.href;
				o.fgid = LZR.getSingleton(LZR.HTML.Util.Finger).uuid;
				ajx.post ("/Vs/srvTrace/", o, null, true);
			});
		});
    },

	// 获取客户端公网IP
	getNetIP: function(onNetIp) {
		var js = document.createElement("script");
		js.src = window.location.protocol + "//pv.sohu.com/cityjson?ie=utf-8";
		js.onload = function () {
			if (returnCitySN) {
				onNetIp({
					ip: returnCitySN.cip,
					city: returnCitySN.cname,
				});
			} else {
				onNetIp(null);
			}
		};
		LZR.spAjax.LZR_domHead_.appendChild (js);
	},

	// 获取客户端内网IP
	getUserIP: function(onNewIP) {
		// onNewIp - your listener function for new IPs
		// compatibility for firefox and chrome (兼容firefox和chrome)
		var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
		if (!myPeerConnection) {
			// 浏览器不支持 WebRTC
			onNewIP("");
			return;
		}
		var pc = new myPeerConnection({
			iceServers: []
		}),
		noop = function() {},
		localIPs = {},
		ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
		key;

		function iterateIP(ip) {
			if (!localIPs[ip]) onNewIP(ip);
			localIPs[ip] = true;
		}

		//create a bogus data channel (创建一个虚假的数据通道)
		pc.createDataChannel("");

		// create offer and set local description (创建offer并设置本地描述)
		pc.createOffer().then(function(sdp) {
			sdp.sdp.split('\n').forEach(function(line) {
				if (line.indexOf('candidate') < 0) return;
				line.match(ipRegex).forEach(iterateIP);
			});

			pc.setLocalDescription(sdp, noop, noop);
		}).catch(function(reason) {
			// An error occurred, so handle the failure to connect (发生错误，因此处理连接失败)
		});

		//sten for candidate events (事件记录)
		pc.onicecandidate = function(ice) {
			if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
			ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
		};
	}

};
