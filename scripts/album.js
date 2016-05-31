var setSong = function(songNumber){
    //convert value to integer
    currentlyPlayingSongNumber = parseInt(songNumber);
    //retrieve array of songs from current album and get index (if song number is 5, the index will be 4) We subtract 1 because songNumbers in the DOM are not zero-based and arrays are zero-based
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
};

var getSongNumberCell= function(number){
    // Return the element with a class of "song-item-number" and an attribute of "data-song-number" that has a value of `number`
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function (songNumber, songName, songLength) {
    var template = 
        '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;
 
    var $row = $(template);
    
    var clickHandler = function() {
        // clickHandler is called when our event
        // listener fires.
        
        // debugger;
        
        // Pulling the song number value
        // off of the attribute called "data-song-number"
        // of the element that fired the event
        // e.g. if the number in song row 1 was clicked
        // `this` is equal to that number.
        var songNumber = parseInt($(this).attr('data-song-number'));
        
        // if we have a song that is currently playing
        if (currentlyPlayingSongNumber !== null) {
            // see getSongNumberCell for note
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
           
           // Set the innerHTML of that cell to
            // `currentlyPlayingSongNumber`
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        
        // if the song that is currently playing
        // is not the song they just clicked on
        if (currentlyPlayingSongNumber !== songNumber) {
            // Set the HTML of this element (the element
            // that fired the event) to a pause button
            $(this).html(pauseButtonTemplate);
            // Set the currentlyPlayingSongNumber variable
            // to the songNumber of the element that was clicked and se the currentSongFromAlbum equal to the clicked song number
            setSong(songNumber);
            // update the player bar song information
            updatePlayerBarSong();
        }
        // If the song that was clicked is the one
        // that is currently playing
        else if (currentlyPlayingSongNumber === songNumber) {
            // Change the HTML of this element to
            // a play button (we are pausing)
            $(this).html(playButtonTemplate);
            // Change the HTML of the player bar pause button
            // to a play button
            $('.main-controls .play-pause').html(playerBarPlayButton);

            // set currentlyPlayingSongNumber an
            // currentSongFromAlbum to null because 
            // the song is being paused, and nothing
            // will be playing.
            
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
        }
        
    };
    
    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if (songNumber !== currentlyPlayingSongNumber){
            songNumberCell.html(playButtonTemplate);
        }
        
    };
    var offHover = function(event) {
         console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
        
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
        
       
    };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function (album) {
    
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');   
    
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    $albumSongList.empty();
   
    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
    }
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var updatePlayerBarSong = function () {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

var nextSong = function (){

    //get previous song index
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    //increment. if currentIndex is last song, next song is index 0
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    // Set a new current song
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    
    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var previousSong = function() {
    
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    
    // decrementing the song (index)
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    // Set a new current song
    //currentlyPlayingSongNumber = currentSongIndex + 1;
    //currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    setSong(songNumber);
    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';



var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
 
$(document).ready(function() {
    setCurrentAlbum(albumPicasso); 
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});

    
    var albums = [albumPicasso, albumMarconi, albumKing]; 
    var index = 1;
        
    albumImage.addEventListener("click", function(event){ //set eventListener to each array object
        setCurrentAlbum(albums[index]);
        index++;
        
        if(index == albums.length){
            index = 0;
        }
    });









