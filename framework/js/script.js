var app = angular.module("myApp", ["ngRoute"]);

  app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
      templateUrl : "pages/home.htm",
      controller: "myCtrl"
    })
    .when("/search/:keyword", {
      templateUrl : "pages/search.htm",
      controller: "searchCtrl"
    })
    .when("/book/:id", {
      templateUrl : "pages/book.htm",
      controller: "bookingCtrl"
    })
  })

  //Factory function for sharing restaurants data between controllers
  app.factory('Restaurant', function (){
    var Data = {};
    
    this.getVar = function () {
      return Data;
    }
    
    this.setVar = function (value) {
      Data = value;
    }
    
    return {
      getVar: this.getVar,
      setVar: this.setVar 
    }
  })


  //booking controller
  app.controller ("bookingCtrl", function ($scope, $compile, $routeParams, Restaurant) {
    var i;

    //Booking date
    var today = new Date();
    var h = today.getHours();

    var weekday = new Array(7);
    weekday[0] =  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[6] = "Saturday";
    weekday[5] = "Friday";
    
    for (i = 0; i < 7; i++)
    {
      $("#date").append('<option value="' + (today.getDate()+i) + '/' + (today.getMonth()+1) + '">' + weekday[today.getDay()+i] + ', ' + (today.getDate()+i) + '/' + (today.getMonth()+1) + '</option>');
    }
    
    
    //Initilize resources
    $scope.restaurants = Restaurant.getVar();
    
    for (i = 0; i < $scope.restaurants.length; i++)
    {
      if ($routeParams.id == $scope.restaurants[i].ID)
      {
        $scope.id = $routeParams.id;
        $scope.name = $scope.restaurants[i].Name;
        $scope.type = $scope.restaurants[i].Type;
        $scope.open = $scope.restaurants[i].Open;
        $scope.close = $scope.restaurants[i].Close;
        $scope.location = $scope.restaurants[i].Location;
        $scope.price = $scope.restaurants[i].Price;
        $scope.image = $scope.restaurants[i].Image;
        $scope.rating = $scope.restaurants[i].Rating;
      }
    }
    
    //Booking time picking
    $scope.settime = function(time) {
      $("#button-time-" + time).removeClass('btn-info').addClass('btn-primary').siblings().removeClass('btn-primary').addClass('btn-info');
      $("#time").attr('value',time);
    };
    
    
    //Add button booking time
    for (i = parseInt($scope.open); i < parseInt($scope.close); i++)
    {
      var $timepick = $('<button type="button" class="btn btn-info" id="button-time-' + i +'" data-ng-click="settime(' + i + ')">' + i + ':00' + '</button>').appendTo('#booking-time');
      $compile($timepick)($scope);
    }
    
  
    //Current status of restaurant
    if (h >= parseInt($scope.open) && h < parseInt($scope.close))
    {
      $('#status').html('Open Now').css('color','#5CB85C');
    }
    else
    {
      $('#status').html('Closed Now').css('color','#D9534F');
    }
    
    
    //Submit form
    $scope.submitform = function() {
      var bookingData = new Object();
      bookingData.id = $routeParams.id;
      bookingData.date = $("#date").val();
      bookingData.time = $("#time").val();
      bookingData.guest = $("#guest-number").val();
      bookingData.fname = $("#fname").val();
      bookingData.lname = $("#lname").val();
      bookingData.email = $("#email").val();
      bookingData.mobile = $("#mobile").val();
        
      var data = JSON.stringify(bookingData);
        
      //Ajax call for form POST submission
      $.ajax({
        type: 'POST',
        url: 'booking.php',
        dataType: "text",
        data: {myData:data},
        success: function(response) {
          $(".modal-body").append('<div class="alert alert-success" role="alert"><strong>' + response + '</strong></div>');
          $(".modal-body").append('<h3>Booking information</h3><br/>');
          $(".modal-body").append('<table class="table" style="border: none;"><tr><th scope="row">Name</th><td>' + bookingData.fname + ' ' + bookingData.lname + '</td></tr><tr><th scope="row">Restaurant</th><td>' + $scope.name + '</td></tr></tr><tr><th scope="row">Guest number</th><td>' + bookingData.guest + '</td></tr><tr><th scope="row">Date</th><td>' + bookingData.date + '</td></tr><tr><th scope="row">Time</th><td>' + bookingData.time + ':00</td></tr><tr><th scope="row">Mobile</th><td>' + bookingData.mobile + '</td></tr></table>');
          $(".modal").on("hidden.bs.modal", function () {
            window.location = "#!";
          });
        }
      });
    };  
  })


  //search controller
  app.controller ("searchCtrl", function ($scope, $routeParams, Restaurant) {
    
    $scope.restaurants = {};

    $.ajax({
      type: 'POST',
      url: 'restaurant.php',
      data: {myData: $routeParams.keyword},
      success: function(data) {
        $scope.$apply(function() {
          $scope.restaurants = data;
          Restaurant.setVar(data);
        })
      }
    });
    
    //Set active sort
    $scope.currentsort = function(n) {
      $("#sort-"+n).css("font-weight", "bold").siblings().css("font-weight","");
    }

    //Sort results
    $scope.sort = function(type, reverse) {
      if ((type == 'Price') && (reverse == false))
      {
        $scope.restaurants.sort(function(a, b){return a.Price > b.Price});
      }
      
      if ((type == 'Price') && (reverse == true))
      {
        $scope.restaurants.sort(function(a, b){return a.Price < b.Price});
      }
        
      if ((type == 'Rating') && (reverse == true))
      {
        $scope.restaurants.sort(function(a, b){return a.Rating < b.Rating});
      }
    };
    
    //Pagination
    $scope.currentPage = 0;

    $scope.range = function() { 
       var rangeSize = Math.floor(($scope.restaurants.length + 4)/5);
       var ret = [];
       var start = $scope.currentPage;
       if (start > $scope.pageCount() - rangeSize ) 
       {
         start = $scope.pageCount() - rangeSize + 1;
       }

       for (var i=start; i<start + rangeSize; i++) {
         ret.push(i);
       }

       return ret;
    };

    $scope.prevPage = function() {
       if ($scope.currentPage > 0) 
       {
         $("html, body").animate({scrollTop: 0}, 500);
         $scope.currentPage--;
       }
    };

    $scope.prevPageDisabled = function() {
      return $scope.currentPage === 0 ? "disabled" : "";
    };

    $scope.nextPage = function() {
      if ($scope.currentPage < $scope.pageCount()) {
        $("html, body").animate({scrollTop: 0}, 500);
        $scope.currentPage++;
      }
    };

    $scope.nextPageDisabled = function() {
      return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
    };

    $scope.pageCount = function() {
       return Math.ceil($scope.restaurants.length/5) - 1;
    };

    $scope.setPage = function(n) {  
      $("html, body").animate({scrollTop: 0}, 500);
      $scope.currentPage = n;
    };

    $scope.resetCurrentPage = function() {
      $scope.currentPage = 0;
    }
})

  
  //Main controller
  app.controller ("myCtrl", function ($scope) {
    //Get visitor location using Google Geolocation API
    $scope.getlocation = function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          $scope.lat = position.coords.latitude;
          $scope.long = position.coords.longitude;
          $.ajax('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.lat + ',' + $scope.long + '&key=AIzaSyC8F0SWH5NyrxXOqdZnauROmMMM3V6fcL8')
          .then(
            function success (response) {
              console.log(response.results[0].address_components[2].long_name);
              $scope.location = response.results[1].address_components[0].long_name;
              $('#location').html($scope.location);
              $('#recommendation-1 a').attr('href','#!search/' + $scope.location);
            },
            function fail (status) {
              console.log('Request failed. Returned status of', status)
            }
          )
        });
      }
    }
    
    //Reload location service every time home is routed
    $scope.$on('$locationChangeStart', function(event) {
      $scope.getlocation();
      $("html, body").animate({scrollTop: 0}, 500);
    });
  }
);

  app.filter("offset", function() {
    return function(input, start) {
      start = parseInt(start, 10);
      return input.slice(start);
    };
  });