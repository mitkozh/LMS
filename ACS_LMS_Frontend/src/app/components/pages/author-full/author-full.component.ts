import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorService } from 'app/core/author.service';
import { Author } from 'app/shared/author';
import { AuthorShortDto } from 'app/shared/author-dto';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { ImageService } from 'app/core/image.service';

@Component({
  selector: 'app-author-full',
  templateUrl: './author-full.component.html',
  styleUrls: ['./author-full.component.scss'],
})
export class AuthorFullComponent implements OnInit {
  authorDescription: String | undefined;
  authorShortDescription: String | undefined;
  authorPhoto: SafeUrl | undefined;
  showFullDescription = false;
  author: AuthorShortDto | undefined;
  authorImage: SafeUrl | undefined;
  authorAsNumArray: number[] | undefined;
  shouldToggle: boolean  = false;

  constructor(
    private authorService: AuthorService,
    private route: ActivatedRoute,
    private router: Router,
    private imageService: ImageService,
    private sanitizer: DomSanitizer
  ) {}

  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        filter((params) => params.has('author')),
        switchMap(() => {
          let authorParam = this.route.snapshot.paramMap.get('author');
          if (authorParam) {
            return this.authorService.getByIdAndRecieveDto(
              parseInt(authorParam)
            );
          }
          throw new Error('Error with author in the query!');
        }),
        catchError(() => {
          this.router.navigate(['/not-found']);
          return [];
        })
      )
      .subscribe((author) => {
        this.author = author;
        this.authorAsNumArray = [author.id]
        console.log(this.authorAsNumArray.at(0))
        this.getPhoto(author.imageId).subscribe(
          (image) => (this.authorImage = image)
        );

        this.authorDescription = author.description;
        this.authorShortDescription = this.authorDescription.substring(0, 300);
    
        if (this.authorDescription !== this.authorShortDescription) {
          this.authorShortDescription += '...';
          this.shouldToggle = true;
        }
          });
  }

  getPhoto(imageId: number): Observable<SafeUrl> {
    console.log(imageId);
    if (imageId) {
      return this.imageService.getImage(imageId).pipe(
        map((res) => {
          console.log(res);
          return this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(res)
          );
        })
      );
    } else {
      return of(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLeqsbTn6eqpr7PJzc/j5ebf4eLZ3N2wtrnBxsjN0NLGysy6v8HT1tissra8wMNxTKO9AAAFDklEQVR4nO2d3XqDIAxAlfivoO//tEOZWzvbVTEpic252W3PF0gAIcsyRVEURVEURVEURVEURVEURVEURVEURVEURVEURflgAFL/AirAqzXO9R7XNBVcy9TbuMHmxjN6lr92cNVVLKEurVfK/zCORVvW8iUBnC02dj+Wpu0z0Y6QlaN5phcwZqjkOkK5HZyPAjkIjSO4fIdfcOwFKkJlX4zPu7Ha1tIcwR3wWxyFhRG6g4Je0YpSPDJCV8a2Sv2zd1O1x/2WMDZCwljH+clRrHfWCLGK8REMiql//2si5+DKWKcWeAGcFMzzNrXC/0TUwQ2s6+LhlcwjTMlYsUIQzPOCb7YBiyHopyLXIEKPEkI/TgeuiidK/R9FniUDOjRDpvm0RhqjMyyXNjDhCfIMYl1gGjIMIuYsnGEYRMRZOMMunaLVwpWRW008v6fYKDIzxCwVAeNSO90BJW6emelYBRF/kHpYGVaoxTDAaxOFsfP9y8hpJ4xd7gOcij7JNGQ1EYFgkPJa1jQEiYZXRaRINKxSDUW9n+FT82lSKadkiru9/4XPqSLWOekGPoY05TAvLm9orm+YWuwHoBHkZKijNBJGmeb61eL6Ff/6q7bLr7yvv3vKGhpDRjvgjGaPz+gUg6YgcvpyAR2FIZ9U6nEEyZRTovmEU32KichpGn7C17XrfyH9gK/c0CMP05HZIM2uf9sEveizKveBy9/6Qt7o89ne33D525cfcIMW6ab+TMEukQbQbu+xu7X3A9bChmWaCeAkG17bpntwXgWxHaMzGPmUaR5dQZiKqRVeUZ3047fi3nAu28h4CHxCsZAgmEH8Y27jJAhm8c+5RQzRQNVGhVFSfxOYIjp/pP7RxzjevYXVGf4eLt+BJ1vCuLuLkrgABgCGXZ2wik5uty+oBvNirI6mkzhAf4Gsb58Hcm67Jzd+KwD10BYPLL3e0MjvKrgAULnOfveF/O4N2Xb9BZom3gJes3F9X5Zze8/6Yt09b4CrqsEjUv8oFBaR2rl+6CZr2xVrp24o/WitBKuGrrpl1+bFkmK2qXTON4VpbdfLa7o7y/WdLxG7lm2Lqh2clOwTegbvc/vj2U78CwhA87Bn8G5Nk3eOb0Nsr9flz3sG78UUtue4kpv1xvjg3TMay62BMlTlP+vrOMnJsRmt/ze0jsfkPPYdAH57hK+34PeOyc8XIXu5xT2HsUkdZz+adwg8HGFfQ3K5jtDvbUiO4Di9/ywHGrL88pDizZ++oTp+an+SMX/ndymUCwmHMdO7yuOx83pUx/eEMU0AvxWndwgidAqOZ8ypCwdEfvvEo6D9HwpA8wzvmOJEqAg9ySu8g4x0Hb9hSB/BANEKJ+LbPBU0lzbAJs4xt1AoshKkUGQmiH8/jJ0gdhTTLmSegHlPE0oOdXALnqDjKYh3px//fSgSWG8UqfrrIICzYYSJXRr9BSPbpNzw7gBjKjKOYI7ReIGqQRIap5+5MdjyvuDkExvGeXSlONWZAP3/AZBwJohU7QJRGU+cTVH18ELmRPNBmibW6MT/k1b0XhdkRBvyT6SB6EYv/GvhSmRNpGngRULsAlxMCGNXp7w3FfdEbTEEDdLI9TdIKRUzUesa3I461ER8cpNT7gMRhpKmYVS9ELOgCUQsa4SsulciKiLbY+AnHD8cpuhISsnxpamI84sbDq9qYJgf8wiiOBrC7Ml7M7ZECCqKoiiKoiiKoiiKoijv5AvJxlZRyNWWLwAAAABJRU5ErkJggg=='
      );
    }
  }
}
