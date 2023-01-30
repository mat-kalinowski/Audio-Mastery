$(window).load(function () {
  if (document.getElementById("loaderr")) {
    document.getElementById("loaderr").outerHTML = "";
    $("a").each(function () {
      var el = $(this);
      el.on("click", function () {
        if (
          el[0].hasAttribute("href") &&
          el.attr("href") != "#" &&
          el.attr("href") != window.location.href
        ) {
          if (!document.getElementById("loaderr")) {
            $("body").prepend("<div id='loaderr'></div>");
          }
        }
      });
    });
  }
});
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomBetweenFloats(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(4));
}
function arrayRemove(array, value) {
  for (var i = array.length - 1; i >= 0; i--) {
    if (array[i] === value) {
      array.splice(i, 1);
    }
  }
  return array;
}
function isset() {
  var a = arguments,
    l = a.length,
    i = 0,
    undef;
  if (l === 0) {
    throw new Error("Empty isset");
  }
  while (i !== l) {
    if (a[i] === undef || a[i] === null) {
      return false;
    }
    i++;
  }
  return true;
}
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
function uniqueArray(value, index, self) {
  return self.indexOf(value) === index;
}
function arraysIntersections(arr1, arr2) {
  var aa = {};
  arr1.forEach(function (v) {
    aa[v] = 1;
  });
  return arr1.filter(function (v) {
    return v in aa;
  });
}
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}
function getArrayRandomElements(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len) {
    console.log("getRandom: more elements taken than available");
  }
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}
function getArrayRandomElement(arr) {
  var r = randomBetween(0, arr.length - 1);
  return arr[r];
}
function getSortedArray(key, order = "asc") {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }
    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];
    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === "desc" ? comparison * -1 : comparison;
  };
}
function getArrayCombinations(arr, length) {
  function c(l, r) {
    var i, ll;
    if (r.length === length) {
      result.push(r);
      return;
    }
    for (i = 0; i < l.length; i++) {
      ll = l.slice();
      c(ll, r.concat(ll.splice(i, 1)));
    }
  }
  var result = [];
  c(arr, []);
  return result;
}
function getUniqueArray(arr) {
  return arr.filter((v, i, a) => a.indexOf(v) === i);
}
function roundNumber(number) {
  return Math.round(number * 1000) / 1000;
}
function hasDuplicates(array) {
  var valuesSoFar = [];
  for (var i = 0; i < array.length; ++i) {
    var value = array[i];
    if (valuesSoFar.indexOf(value) !== -1) {
      return true;
    }
    valuesSoFar.push(value);
  }
  return false;
}
function allPossibleCases(arr, seperator) {
  if (arr.length == 1) {
    return arr[0];
  } else {
    var result = [];
    var allCasesOfRest = allPossibleCases(arr.slice(1), seperator);
    for (var i = 0; i < allCasesOfRest.length; i++) {
      for (var j = 0; j < arr[0].length; j++) {
        result.push(arr[0][j] + seperator + allCasesOfRest[i]);
      }
    }
    return result;
  }
}
var QueryString = (function () {
  var query_string = {};
  var query = window.location.search.substring(1);
  if (query != "") {
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = decodeURIComponent(pair[1]);
      } else if (typeof query_string[pair[0]] === "string") {
        var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
        query_string[pair[0]] = arr;
      } else {
        query_string[pair[0]].push(decodeURIComponent(pair[1]));
      }
    }
  }
  return query_string;
})();
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function simpleFormatBigNumbers(num) {
  if (num >= 100000000) {
    return formatBigNumbers(num);
  } else {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
function formatBigNumbers(num) {
  var si = [
    { value: 1, symbol: "", digits: 0 },
    { value: 1e3, symbol: "k", digits: 3 },
    { value: 1e6, symbol: "M", digits: 0 },
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (
    (num / si[i].value).toFixed(si[i].digits).replace(rx, "$1") + si[i].symbol
  );
}
function fetchJSONFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
        if (callback) callback(data);
      }
    }
  };
  httpRequest.open("GET", path);
  httpRequest.send();
}
var params = { i: 0 };
function updateGameDiff(ele) {
  $(ele).html($(ele).attr("loading"));
  $.ajax({
    url: baseUrl + "/games/UpdateGameDiff",
    type: "POST",
    data: $(ele).parents("form").serialize(),
    success: function () {
      $(ele).html($(ele).attr("success"));
      location.reload();
    },
    error: function () {
      $(ele).html($(ele).attr("error"));
      setTimeout(function () {
        $(ele).html($(ele).attr("reset"));
      }, 2500);
    },
  });
}
function setParam(btn, name, value) {
  if (name == "i") {
    $(".sprites div").removeClass("selected");
  }
  $(btn).parent().addClass("selected");
  params[name] = value;
}
function startGame(btn, practice) {
  var t = practice ? "&practice=on" : "",
    gameUrl = baseUrl + "/games/start?id=" + $(btn).attr("gameid") + t,
    p = "";
  if (params.i == 0) {
    params.i = $(btn).attr("sprite");
  }
  $.each(params, function (key, value) {
    p += "&" + key + "=" + value;
  });
  window.location.href = gameUrl + p;
}
function startPractice(e) {
  var url = "/games/practice?id=" + $(e).attr("practice") + "&i=" + params.i;
  window.location.href = baseUrl + url;
}
function startBeatsGame(btn, practice) {
  var t = practice ? "&practice=on" : "",
    gameUrl = baseUrl + "/beats/start?id=" + $(btn).attr("gameid") + t,
    p = "";
  if (params.i == 0) {
    params.i = $(btn).attr("sprite");
  }
  $.each(params, function (key, value) {
    p += "&" + key + "=" + value;
  });
  window.location.href = gameUrl + p;
}
function playGame(btn, practice) {
  var t = practice ? "&practice=on" : "",
    gameUrl = baseUrl + "/games/play?id=" + $(btn).attr("gameid") + t,
    p = "";
  if (params.i == 0) {
    params.i = $(btn).attr("sprite");
  }
  $.each(params, function (key, value) {
    p += "&" + key + "=" + value;
  });
  window.location.href = gameUrl + p;
}
function loadJSfile(filename) {
  var fileref = document.createElement("script");
  fileref.setAttribute("type", "text/javascript");
  fileref.setAttribute("src", filename);
}
function buildLives() {
  var i,
    l = "";
  for (i = 0; i < lives; i++) {
    l += '<i class="fa fa-user"></i>';
  }
  $("#lives").html(l);
}
function informer(data) {
  $.ajax({
    url: baseUrl + "/api/UserAction/upUserData",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(data),
    success: function (data) {},
    error: function (xhr, ajaxOptions, thrownError) {},
  });
}
function device() {
  var audioAPI = window.AudioContext || window.webkitAudioContext || false;
  if (!audioAPI) {
    openTempPopup("8_device", 0);
  }
}
function acceptCookies() {
  $.ajax({ url: baseUrl + "/site/acceptCookies" });
  $("[accept-cookies]").fadeOut();
}
function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last, deferTimer;
  return function () {
    var context = scope || this;
    var now = +new Date(),
      args = arguments;
    if (last && now < last + threshhold) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}
function ReadNotifications(ele, isRedirect = true) {
  $.ajax({
    url: baseUrl + "/notification/read?id=" + $(ele).attr("sid"),
    type: "POST",
    data: $(ele).parents("form").serialize(),
    success: function (data) {
      if (isRedirect) {
        window.location.href = $(ele).attr("url");
      }
    },
  });
}
function ReadMessages(ele) {
  $.ajax({
    url: baseUrl + "/messages/read?id=" + $(ele).attr("sid"),
    type: "POST",
    data: $(ele).parents("form").serialize(),
    success: function (data) {
      window.location.href = $(ele).attr("url");
    },
  });
}
function selectItem(ele) {
  var parent = $(ele).parents(".btn-group"),
    selected = parent.find(".dropdown-toggle"),
    input = parent.find('input[type="hidden"]');
  selected.html($(ele).html() + '<i class="fa fa-caret-down"></i>');
  input.val($(ele).attr("val"));
}
function closePopover(ele) {
  $(ele).parents(".popover").prev().popover("hide");
}
function initJSelements() {
  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]').popover();
}
function getNotifications(ele) {
  var div = $("#notifications-list");
  $.ajax({
    url: baseUrl + "/notification/new",
    beforeSend: function () {
      $(ele).html($(ele).attr("loading"));
    },
    success: function (data) {
      div.html(data).show();
      $(ele)
        .html($(ele).attr("reset"))
        .attr("href", $(ele).attr("url"))
        .attr("onclick", "");
      $("#notifications-counter").remove();
      $("section").on("click", function () {
        div.hide();
      });
    },
    error: function () {
      $(ele).html($(ele).attr("reset"));
    },
  });
}
function DismissAllNotifications(refresh) {
  $("#notifications-list").html("");
  $("#notifications-counter").remove();
  $.ajax({
    url: baseUrl + "/notification/dismissAll",
    success: function () {
      if (refresh) {
        location.reload();
      }
    },
  });
}
function DismissAllMessages(ele) {
  $.ajax({
    url: baseUrl + "/message/dismissAll",
    type: "POST",
    dataType: "json",
    data: $(ele).parents("form").serialize(),
    beforeSend: function () {
      $(ele).html($(ele).attr("beforeSend"));
    },
    success: function (data) {
      $(ele).html($(ele).attr("success"));
      $(".message-item").attr("read", "1");
      $("#message-menu .counter").html("");
      setTimeout(function () {
        $(ele).html($(ele).attr("reset"));
      }, 2500);
    },
    error: function () {
      $(ele).html($(ele).attr("error"));
      setTimeout(function () {
        $(ele).html($(ele).attr("reset"));
      }, 2500);
    },
  });
}
function previewImage(ele) {
  $("#previewModal .previewBody").html(
    '<img src="' +
      $(ele).attr("url") +
      '" class="img-responsive img-rounded" />'
  );
  $("#previewModal").modal("show");
}
function seeExtra(ele) {
  $.ajax({
    url:
      baseUrl +
      "/member/" +
      $(ele).attr("member") +
      "?m=" +
      $(ele).attr("serial"),
    success: function (data) {
      $(ele).parents(".box").find(".members").html(data);
      initJSelements();
    },
  });
}
function compareLearningPoints(ele) {
  $.ajax({
    url: baseUrl + "/learn/compare",
    beforeSend: function () {
      $(ele).html($(ele).attr("loading"));
    },
    success: function (data) {
      $("body").append(data);
      $("#compareLearningPointsModal").modal("show");
      $(ele).html($(ele).attr("reset"));
    },
    error: function () {
      $(ele).html($(ele).attr("reset"));
    },
  });
}
function openTempPopup(type, delay) {
  $.ajax({
    url: baseUrl + "/dashboard/tempPopup?type=" + type,
    success: function (data) {
      monitorPopup(type);
      $("body").append(data);
      setTimeout(function () {
        $("#" + type).modal("show");
        monitorClicks();
      }, delay);
    },
  });
}
function closeTempPopup(ele) {
  var modal = $(ele).parents(".modal");
  modal.modal("hide");
  setTimeout(function () {
    modal.remove();
  }, 500);
}
function compare() {
  var ele = $("#compareModal"),
    body = ele.find(".modal-body");
  ele.modal("show");
  $.ajax({
    url: baseUrl + "/dashboard/compareSpi",
    beforeSend: function () {
      body.html(body.attr("loading"));
    },
    success: function (data) {
      body.html(data);
      monitorClicks();
    },
    error: function (xhr, ajaxOptions, thrownError) {
      body.html(body.attr("error"));
    },
  });
}
function compareGame(btn) {
  var ele = $("#compareModal"),
    body = ele.find(".modal-body"),
    gameid = $(btn).attr("gameid");
  ele.modal("show");
  $.ajax({
    url: baseUrl + "/dashboard/compareGame?id=" + gameid,
    beforeSend: function () {
      body.html(body.attr("loading"));
    },
    success: function (data) {
      body.html(data);
      monitorClicks();
    },
    error: function (xhr, ajaxOptions, thrownError) {
      body.html(body.attr("error"));
    },
  });
}
function compareBeatGame(btn) {
  var ele = $("#compareModal"),
    body = ele.find(".modal-body"),
    gameid = $(btn).attr("gameid");
  ele.modal("show");
  $.ajax({
    url: baseUrl + "/beats/compareGame?id=" + gameid,
    beforeSend: function () {
      body.html(body.attr("loading"));
    },
    success: function (data) {
      body.html(data);
      monitorClicks();
    },
    error: function (xhr, ajaxOptions, thrownError) {
      body.html(body.attr("error"));
    },
  });
}
function IsWorkoutExpired() {
  $.ajax({
    url: baseUrl + "/dashboard/isWorkoutExpired",
    type: "POST",
    dataType: "json",
    success: function (response) {
      if (response.expired == "yes") {
        location.reload();
      }
    },
  });
}
function postToMail(ele) {
  $.ajax({
    url: baseUrl + "/blog/send?id=" + $(ele).attr("post-id"),
    type: "POST",
    dataType: "json",
    beforeSend: function () {
      $(ele).html($(ele).attr("beforeSend"));
    },
    success: function (data) {
      console.log(data);
      $(ele).html($(ele).attr("success"));
      setTimeout(function () {
        $(ele).html($(ele).attr("reset"));
      }, 2500);
    },
    error: function () {
      $(ele).html($(ele).attr("error"));
      setTimeout(function () {
        $(ele).html($(ele).attr("reset"));
      }, 2500);
    },
  });
}
function InitCountdownClock() {
  var endTime = parseInt($(".countdown-clock").attr("end")),
    utcTime = new Date().getTime(),
    milisecLeft = endTime - utcTime;
  function CountdownRun(sec) {
    var clock;
    clock = $(".countdown-clock").FlipClock({
      clockFace: "DailyCounter",
      autoStart: false,
    });
    clock.setTime(sec);
    clock.setCountdown(true);
    clock.start();
  }
  if (milisecLeft > 0) {
    var x = setInterval(function () {
      var distance = endTime - milisecLeft;
      if (distance < 0) {
        clearInterval(x);
        $(".countdown-clock").html("");
      }
      milisecLeft = milisecLeft - 1000;
    }, 1000);
    $(".countdown-clock").attr("status", "enabled");
    CountdownRun(Math.round(milisecLeft / 1000));
  }
}
function TranslatorAssignment(ele) {
  $(ele).html($(ele).attr("loading"));
  $.ajax({
    url: baseUrl + "/multilingual/translatorAssignment",
    type: "POST",
    success: function () {
      window.location.replace(baseUrl + "/multilingual/index");
    },
  });
}
function temporarilyDisableBtn(e) {
  $(e).prop("disabled", true);
  setTimeout(
    function (e) {
      $(e).prop("disabled", false);
    },
    1000,
    e
  );
}
function htmlEntityEncode(str) {
  var replacements = { "&#39;": "'", "&#34;": '"' };
  $.each(replacements, function (htmlEntity, replacement) {
    str.replaceAll(htmlEntity, replacement);
  });
  return str;
}
function getOrdinal(number) {
  var ends = {
      0: "th",
      1: "st",
      2: "nd",
      3: "rd",
      4: "th",
      5: "th",
      6: "th",
      7: "th",
      8: "th",
      9: "th",
    },
    postfix =
      number % 100 >= 11 && number % 100 <= 13 ? "th" : ends[number % 10];
  return number + "<sub>" + postfix + "</sub>";
}
