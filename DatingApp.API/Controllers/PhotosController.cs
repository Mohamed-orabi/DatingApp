using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    
    [ApiController]
    [Route("api/users/{userId}/photos")]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private Cloudinary _cloudinary;
        private readonly IMapper _map;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        public PhotosController(IDatingRepository repo,
                                IMapper map,
                                IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _cloudinaryConfig = cloudinaryConfig;
            _map = map;
            _repo = repo;

            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);
        }

    [HttpGet("{id}",Name = "GetPhoto")]
    public async Task<IActionResult> GetPhoto(int id)
    {
        var photoFromRepo = await _repo.GetPhoto(id);

        var photo = _map.Map<PhotoForReturnDto>(photoFromRepo);

        return Ok(photo);
        
    }

    [HttpPost]
    public async Task<IActionResult> AddPhotoForUser(int userId ,[FromForm] PhotoForCreationDto photoForCreationDto)
    {
        if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();

        var userFromRepo = await _repo.GetUser(userId);

        //A file we upload on website
        var file = photoForCreationDto.File;

        // We store results that we get back from cloudinary
        var uploadResult = new ImageUploadResult();

        if(file.Length > 0)
        {
            using(var stream = file.OpenReadStream())
            {
                // We need to give cloudinry parameters
                var uploadParam = new ImageUploadParams()
                {
                    File = new FileDescription(file.Name,stream),
                    Transformation = new Transformation().Width(500)
                    .Height(500).Crop("fill").Gravity("face")
                };

                //the method Upload uploads an image to the cloud
                uploadResult = _cloudinary.Upload(uploadParam);
            }
        } 

        photoForCreationDto.Url = uploadResult.Uri.ToString();
        photoForCreationDto.PublicId = uploadResult.PublicId;

        var photo = _map.Map<Photo>(photoForCreationDto);

        if(!userFromRepo.Photos.Any(u => u.IsMain))
            photo.IsMain = true;

        userFromRepo.Photos.Add(photo);

        if(await _repo.SaveAll())
        {
            var PhotoToReturn = _map.Map<PhotoForReturnDto>(photo);
            return CreatedAtRoute("GetPhoto",new {id = photo.Id},PhotoToReturn);
        }

        return BadRequest("Could not add the Photo");

    }

    [HttpPost("{id}/setMain")]
    public async Task<IActionResult> SetMainPhoto(int userId , int id)
    {
        if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();

        var user = await _repo.GetUser(userId);

        if(!user.Photos.Any(p => p.Id == id))
            return Unauthorized();

        var photoFromRepo = await _repo.GetPhoto(id);

        if(photoFromRepo.IsMain)
            return BadRequest("This is already the main photo");

        var currentPhoto = await _repo.GetMainPhotoFromUser(userId);
        currentPhoto.IsMain = false;

        photoFromRepo.IsMain = true;

        if(await _repo.SaveAll())
            return NoContent();

        return BadRequest("could not set photo to main");
    }

}

}