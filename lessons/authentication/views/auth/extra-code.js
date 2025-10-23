/*

edit-profile - form
<div class="avatar-upload">
                <div class="avatar-preview">
                  <% if (avatarUrl) { %>
                    <img src="<%= avatarUrl %>" alt="Current profile picture" id="avatar-preview-img">
                  <% } else { %>
                    <div class="avatar-placeholder" id="avatar-placeholder">
                      <i class="fas fa-user"></i>
                    </div>
                    <img src="" alt="Preview" id="avatar-preview-img" style="display: none;">
                  <% } %>
                </div>
                
                <div class="avatar-edit">
                  <label for="avatar" class="avatar-upload-btn">
                    <i class="fas fa-camera"></i> Change Photo
                  </label>
                  <input type="file" id="avatar" name="avatar" accept="image/*" class="avatar-input" />
                  <% if (avatarUrl) { %>
                    <button type="button" id="remove-avatar" class="remove-avatar-btn">
                      <i class="fas fa-trash"></i> Remove
                    </button>
                  <% } %>
                </div>
              </div>

*/