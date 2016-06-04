var setSong = function(songNumber){
    //if a sound is already playing, stop it.
    if (currentSoundFile) {
         currentSoundFile.stop();
     }
    //convert value to integer
    currentlyPlayingSongNumber = parseInt(songNumber);
    //retrieve array of songs from current album and get index (if song number is 5, the index will be 4) We subtract 1 because songNumbers in the DOM are not zero-based and arrays are zero-based
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    
    //assign Buzz sound object by passing the audio file via audioURL
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         //all of our songs are mp3s so we only include the mp3 string
         formats: [ 'mp3' ],
        //tells Buzz to load mp3s as soon as page loads 
        preload: true
     });
    
    setVolume(currentVolume);
 };
 
var setVolume = function(volume) {
    //check if sound file exists
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
 };


var getSongNumberCell= function(number){
    // Return the element with a class of "song-item-number" and an attribute of "data-song-number" that has a value of `number`
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var togglePlayFromPlayerBar = function() {
    if (currentSoundFile === null) {
        return;
    }
    
    var songNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    if (currentSoundFile.isPaused()){
        
        //change songNumberCell to pause button
        songNumberCell.html(pauseButtonTemplate);
        // Change the HTML of the player bar play button to a pause button
        $playPauseButton.html(playerBarPauseButton);
        //play the sound
        currentSoundFile.play();
    }
    
    else {
        //change songNumberCell to play button
        songNumberCell.html(currentlyPlayingSongNumber);
        // Change the HTML of the player bar pause button to a play button
        $playPauseButton.html(playerBarPlayButton);
        //pause the sound
        currentSoundFile.pause();
        // we do a couple of other things
        // when we pause
    }
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
        
         debugger;
        
        // Pulling the song number value
        // off of the attribute called "data-song-number"
        // of the element that fired the event
        // e.g. if the number in song row 1 was clicked
        // `this` is equal to that number.
        var songNumber = parseInt($(this).attr('data-song-number'));
        
        // if the song that is currently playing
        // is not the song they just clicked on
        if (currentlyPlayingSongNumber !== songNumber) {
            // Set the HTML of this element (the element
            // that fired the event) to a pause button
            $(this).html(pauseButtonTemplate);
            // Set the currentlyPlayingSongNumber variable
            // to the songNumber of the element that was clicked and se the currentSongFromAlbum equal to the clicked song number
            setSong(songNumber);
            //play the currentSoundFile
            currentSoundFile.play();
            // update the player bar song information
            updatePlayerBarSong();
        }
        // If the song that was clicked is the one
        // that is currently playing
        else if (currentlyPlayingSongNumber === songNumber) {
    
            //if the song is paused, play it
            if (currentSoundFile.isPaused()){
                //Change the HTML of this element to a pause button (we are playing)
                $(this).html(pauseButtonTemplate);
                // Change the HTML of the player bar play button to a pause button
                $playPauseButton.html(playerBarPauseButton);
                //play the music
                 currentSoundFile.play();
            //if the song is not paused, pause it        
            } else {
                //Change the HTML of this element to a play button (we are pausing)
                $(this).html(playButtonTemplate);
                // Change the HTML of the player bar pause button to a play button
                $playPauseButton.html(playerBarPlayButton);
                //pause the music
                currentSoundFile.pause();
                currentlyPlayingSongNumber = null;
                }
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
         //console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
        
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
    setSong(currentSongIndex +1);
    
    //play songs when skipping
    currentSoundFile.play();
    
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
    setSong(currentSongIndex +1);
    //play songs when skipping
    currentSoundFile.play();
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
var currentSoundFile = null;
var currentVolume = 80;

var $playPauseButton = $('.main-controls .play-pause');
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso); 
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    
    //on click execure togglePlayPauseButton
    $playPauseButton.click(togglePlayFromPlayerBar);
});

    
var albums = [albumPicasso, albumMarconi, albumKing]; 
var index = 1;
        
albumImage.addEventListener("click", function(event){       //set eventListener to each array object
    setCurrentAlbum(albums[index]);
    index++;
        
    if(index == albums.length){
        index = 0;
    }
});