import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CommentService, Comment } from '../../../services/comment.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  comments: Comment[] = [];
  userId!: string;

  constructor(private route: ActivatedRoute, private commentService: CommentService) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId')!; // Extract userId from the route
    this.fetchComments();
  }

  fetchComments(): void {
    this.commentService.getAllCommentsForUser(this.userId).subscribe({
      next: (comments) => {
        this.comments = comments;
        console.log('Fetched comments:', comments);
      },
      error: (err) => {
        console.error('Error fetching comments:', err);
      }
    });
  }

  convertTimestampToDate(timestamp: Timestamp): Date {
    return timestamp.toDate();
  }
}
